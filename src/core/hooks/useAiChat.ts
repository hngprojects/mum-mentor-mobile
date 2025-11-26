import { auth } from "@/src/lib/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../lib/api";

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
}

interface ChatData {
  conversations: ChatSession[];
  pagination: {
    next: number | null;
    page: number;
    per_page: number;
    prev: number | null;
    total_count: number;
    total_pages: number;
  };
}

// API Response types
interface ApiMessage {
  id: string;
  sender: "user" | "ai";
  message: string;
  created_at: string;
}

interface ApiChatResponse {
  conversation: ChatSession;
  messages: ApiMessage[];
  pagination: {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
    next: number | null;
    prev: number | null;
  };
}

// Display message type (what your UI expects)
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  link?: { url: string; title: string };
}

interface SendMessageParams {
  session_id: string;
  message: string;
  onChunk?: (chunk: string) => void;
  onComplete?: (messageId: string) => void;
}

const CHAT_KEYS = {
  all: ["ai-chats"] as const,
  session: (id: string) => ["ai-chats", id] as const,
};

/* -----------------------------------------------------------
   LIST USER CONVERSATIONS
------------------------------------------------------------ */
export const useChatList = () => {
  return useQuery({
    queryKey: CHAT_KEYS.all,
    queryFn: async () => {
      const res = await authApi.get("/api/v1/ai-chat/chats/");
      const data = res.data.data as ChatData;
      return data; // Returns the full ChatData object with conversations array
    },
  });
};

/* -----------------------------------------------------------
   CREATE CHAT SESSION
------------------------------------------------------------ */
export const useCreateChat = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await authApi.post("/api/v1/ai-chat/chats/");
      return res.data.data as ChatSession;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CHAT_KEYS.all });
    },
  });
};

/* -----------------------------------------------------------
   GET CHAT MESSAGES - WITH PROPER MAPPING
------------------------------------------------------------ */
export const useChatMessages = (sessionId?: string) => {
  return useQuery({
    queryKey: CHAT_KEYS.session(sessionId || ""),
    queryFn: async () => {
      if (!sessionId) return { messages: [] };

      const res = await authApi.get(`/api/v1/ai-chat/chats/${sessionId}`);
      const data = res.data.data as ApiChatResponse;

      // Transform API messages to display format
      const transformedMessages: Message[] = data.messages.map((msg) => ({
        id: msg.id,
        text: msg.message,
        isUser: msg.sender === "user",
        timestamp: msg.created_at,
      }));

      return {
        conversation: data.conversation,
        messages: transformedMessages,
        pagination: data.pagination,
      };
    },
    enabled: !!sessionId,
  });
};

/* -----------------------------------------------------------
   SEND MESSAGE WITH STREAMING + OPTIMISTIC UPDATES
------------------------------------------------------------ */
export const useSendAiMessage = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      session_id,
      message,
      onChunk,
      onComplete,
    }: SendMessageParams) => {
      const baseURL = authApi.defaults.baseURL || "";
      const token = await auth.getAccessToken();

      const response = await fetch(
        `${baseURL}/api/v1/ai-chat/chats/${session_id}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let messageId = "";

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "start") {
                messageId = data.message_id;
              } else if (data.type === "chunk" && onChunk) {
                onChunk(data.content);
              } else if (data.type === "done") {
                messageId = data.message_id;
                if (onComplete) {
                  onComplete(messageId);
                }
              }
            } catch (e) {
              console.error("Failed to parse SSE data:", e);
            }
          }
        }
      }

      return { messageId };
    },
    // OPTIMISTIC UPDATE: Add user message immediately
    onMutate: async ({ session_id, message }) => {
      // Cancel any outgoing refetches
      await qc.cancelQueries({ queryKey: CHAT_KEYS.session(session_id) });

      // Snapshot the previous value
      const previousMessages = qc.getQueryData(CHAT_KEYS.session(session_id));

      // Optimistically update with the new user message
      qc.setQueryData(CHAT_KEYS.session(session_id), (old: any) => {
        if (!old) return old;

        const newUserMessage: Message = {
          id: `temp-${Date.now()}`, // Temporary ID
          text: message,
          isUser: true,
          timestamp: new Date().toISOString(),
        };

        return {
          ...old,
          messages: [...(old.messages || []), newUserMessage],
        };
      });

      // Return context with the previous value
      return { previousMessages };
    },
    // If mutation fails, rollback
    onError: (err, { session_id }, context) => {
      if (context?.previousMessages) {
        qc.setQueryData(
          CHAT_KEYS.session(session_id),
          context.previousMessages
        );
      }
    },
    // Always refetch after error or success
    onSettled: (_, __, { session_id }) => {
      qc.invalidateQueries({ queryKey: CHAT_KEYS.session(session_id) });
    },
  });
};

/* -----------------------------------------------------------
   DELETE CONVERSATION
------------------------------------------------------------ */
export const useDeleteConversation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (conversation_id: string) => {
      const res = await authApi.delete(
        `/api/v1/ai-chat/conversations/${conversation_id}`
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CHAT_KEYS.all });
    },
  });
};

/* -----------------------------------------------------------
   RENAME CONVERSATION
------------------------------------------------------------ */
export const useRenameConversation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversation_id,
      newTitle,
    }: {
      conversation_id: string;
      newTitle: string;
    }) => {
      const res = await authApi.patch(
        `/api/v1/ai-chat/chats/${conversation_id}/title`,
        { title: newTitle }
      );
      return res.data;
    },
    onSuccess: (_, { conversation_id }) => {
      // Invalidate both the list and the specific session
      qc.invalidateQueries({ queryKey: CHAT_KEYS.all });
      qc.invalidateQueries({ queryKey: CHAT_KEYS.session(conversation_id) });
    },
  });
};
