import apiClient from "./apiClient";

const TASKS_ENDPOINT = "/api/v1/tasks";

// --- Fetch Tasks with Optional Query Params ---
export async function fetchTasks(params?: {
  page?: number;
  per_page?: number;
  task_status?: string;
}) {
  const query: Record<string, any> = {};

  if (params?.page) query.page = params.page;
  if (params?.per_page) query.per_page = params.per_page;
  if (params?.task_status) query.task_status = params.task_status;

  try {
    const response = await apiClient.get(TASKS_ENDPOINT, { params: query });
    return response.data;
  } catch (error) {
    console.debug("Error fetching tasks:", error);
    return null;
  }
}

export async function createTask({
  name,
  description,
  due_date,
}: {
  name: string;
  description: string;
  due_date: string;
}) {
  const response = await apiClient.post(`${TASKS_ENDPOINT}`, {
    name,
    description,
    due_date,
  });

  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    // throw error if response status is not 2xx
    throw new Error(response.data?.message || "Failed to create task");
  }
}

export async function updateTask({
  id,
  name,
  description,
  due_date,
}: {
  id: string;
  name: string;
  description: string;
  due_date: string;
}) {
  const response = await apiClient.patch(`${TASKS_ENDPOINT}/${id}`, {
    name,
    description,
    due_date,
    status: "pending",
  });

  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    // throw error if response status is not 2xx
    throw new Error(response.data?.message || "Failed to update task");
  }
}

// --- Delete Task by ID ---
export async function deleteTask(taskId: string) {
  try {
    const response = await apiClient.delete(`${TASKS_ENDPOINT}/${taskId}`);
    return response.data;
  } catch (error) {
    console.debug("Error deleting task:", error);
    return null;
  }
}

export async function toggleTaskStatus(taskId: string, status: boolean) {
  try {
    const response = await apiClient.patch(
      `${TASKS_ENDPOINT}/${taskId}/status`,
      { completed: status }
    );
    return response.data;
  } catch (error) {
    console.debug("Error updating task:", error);
    return null;
  }
}
