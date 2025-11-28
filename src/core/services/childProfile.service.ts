// core/services/childProfile.service.ts
import axios, { AxiosError } from "axios";
import {
  ChildProfile,
  CreateChildProfileRequest,
  UpdateChildProfileRequest,
  UploadProfilePictureResponse,
  ApiError,
} from "../../types/child.types";

import { getAuthToken } from "./authStorage";

// ===============================
// BASE URL
// ===============================
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://api.staging.kaizen.emerj.net";

// ===============================
// AXIOS INSTANCE
// ===============================
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// RESPONSE INTERCEPTOR
// ===============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API ERROR", error.response?.data);
    return Promise.reject(error);
  }
);

// ======================================================================
// GET ALL CHILD PROFILES
// ======================================================================
export const getChildProfiles = async (): Promise<ChildProfile[]> => {
  try {
    const response = await api.get<{
      data: { children: ChildProfile[] };
    }>("/api/v1/child-profiles/");

    return response.data.data.children;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// ======================================================================
// GET ONE CHILD PROFILE
// ======================================================================
export const getChildProfile = async (
  childId: string
): Promise<ChildProfile> => {
  try {
    const response = await api.get<{
      data: { child: ChildProfile };
    }>(`/api/v1/child-profiles/${childId}`);

    return response.data.data.child;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// ======================================================================
// CREATE CHILD PROFILE - ENHANCED ERROR HANDLING
// ======================================================================
export const createChildProfile = async (
  data: CreateChildProfileRequest
): Promise<ChildProfile> => {
  try {
    console.log("📤 Sending child profile request:", data);
    
    const response = await api.post("/api/v1/child-profiles/", data);

    console.log("📥 Full API response:", JSON.stringify(response.data, null, 2));

    // Check multiple possible response structures
    const child = 
      response.data?.data?.child || // Expected structure: { data: { child: {...} } }
      response.data?.child ||        // Alternative structure: { child: {...} }
      response.data?.data ||         // Another alternative: { data: {...} }
      response.data;                 // Direct structure: { id, name, ... }

    console.log("👶 Extracted child object:", child);

    // Validate child object has ID
    if (!child || typeof child !== 'object') {
      console.error("❌ Invalid child object:", child);
      throw new Error("Server returned invalid child profile data");
    }

    if (!child.id) {
      console.error("❌ Child object missing ID:", child);
      throw new Error("Server did not return child ID. Response: " + JSON.stringify(child));
    }

    console.log("✅ Child profile created successfully with ID:", child.id);
    return child as ChildProfile;
  } catch (error) {
    console.error("❌ Error in createChildProfile:", error);
    handleApiError(error);
    throw error;
  }
};

// ======================================================================
// UPDATE CHILD PROFILE
// ======================================================================
export const updateChildProfile = async (
  childId: string,
  data: UpdateChildProfileRequest
) => {
  try {
    const response = await api.patch<{
      data: { child: ChildProfile };
    }>(`/api/v1/child-profiles/${childId}`, data);

    return response.data.data.child;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// ======================================================================
// DELETE CHILD PROFILE
// ======================================================================
export const deleteChildProfile = async (
  childId: string
): Promise<void> => {
  try {
    await api.delete(`/api/v1/child-profiles/${childId}`);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// ======================================================================
// UPLOAD CHILD PROFILE PICTURE - ENHANCED ERROR HANDLING
// ======================================================================
export const uploadChildProfilePicture = async (
  childId: string,
  image: { uri: string; name?: string; type?: string } | File
): Promise<UploadProfilePictureResponse> => {
  try {
    console.log("🖼 Starting profile picture upload for child:", childId);
    
    const formData = new FormData();

    // Handle File object (web)
    if (image instanceof File) {
      console.log("📁 Uploading File object:", image.name);
      formData.append("file", image);
    } 
    // Handle URI object (mobile)
    else if (typeof image === 'object' && 'uri' in image) {
      const fileName = image.name || `child_${childId}.jpg`;
      const fileType = image.type || "image/jpeg";

      if (image.uri.startsWith("blob:")) {
        // WEB — convert blob URL to File
        console.log("🌐 Converting blob URL to File");
        const blob = await fetch(image.uri).then((r) => r.blob());
        formData.append("file", new File([blob], fileName, { type: fileType }));
      } else {
        // NATIVE — standard FormData
        console.log("📱 Using native URI:", image.uri);
        formData.append("file", {
          uri: image.uri,
          name: fileName,
          type: fileType,
        } as any);
      }
    } else {
      throw new Error("Invalid image format");
    }

    console.log("📤 Sending image upload request...");
    
    const response = await api.post(
      `/api/v1/child-profiles/${childId}/upload-picture`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log("✅ Image upload response:", JSON.stringify(response.data, null, 2));
    console.log("📋 Response status:", response.status);
    console.log("📋 Response headers:", response.headers);
    
    // Log what URL the server returned (if any)
    if (response.data?.profile_picture_url) {
      console.log("🖼 Server returned image URL:", response.data.profile_picture_url);
    } else if (response.data?.data?.profile_picture_url) {
      console.log("🖼 Server returned image URL:", response.data.data.profile_picture_url);
    } else if (response.data?.url) {
      console.log("🖼 Server returned image URL:", response.data.url);
    } else {
      console.warn("⚠️ Server did not return an image URL in response");
    }
    
    // The response should contain the updated profile with the new image URL
    // Return the full response so we can use it if needed
    return response.data;
  } catch (error) {
    console.error("❌ Upload failed:", error);
    if (axios.isAxiosError(error)) {
      console.error("Upload error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
    handleApiError(error);
    throw error;
  }
};

// ======================================================================
// ERROR HANDLER - ENHANCED
// ======================================================================
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    console.error("🔴 Axios Error Details:", {
      url: axiosError.config?.url,
      method: axiosError.config?.method,
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      message: axiosError.message,
    });

    // Extract user-friendly error message
    const errorMessage = 
      axiosError.response?.data?.message ||
      axiosError.response?.data?.detail ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      "An unexpected error occurred";

    // You could throw a custom error here if needed
    // throw new Error(errorMessage);
  } else if (error instanceof Error) {
    console.error("🔴 Error:", error.message);
  } else {
    console.error("🔴 Unknown Error:", error);
  }
};

// ======================================================================
// UTILITIES
// ======================================================================
export const formatDateForApi = (date: Date) =>
  date.toISOString().split("T")[0];

export const parseDateFromApi = (s: string) => new Date(s);

export const calculateAge = (dob: string) => {
  const today = new Date();
  const birth = new Date(dob);

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    days += 30;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return years > 0
    ? `${years} year${years > 1 ? "s" : ""} old`
    : months > 0
    ? `${months} month${months > 1 ? "s" : ""} old`
    : "Newborn";
};