// hooks/useImageUpload.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { authApi } from "../../lib/api";

interface UploadedImage {
  id: string;
  image_url: string;
  filename: string;
  size: number;
  mimetype: string;
  createdAt: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

interface UploadOptions {
  onSuccess?: (data: UploadedImage) => void;
  onError?: (error: Error) => void;
  invalidateQueries?: string[];
}

export const useImageUpload = (options?: UploadOptions) => {
  const queryClient = useQueryClient();

  const upload = useMutation<
    ApiResponse<UploadedImage>,
    Error,
    ImagePicker.ImagePickerAsset
  >({
    mutationFn: async (image: ImagePicker.ImagePickerAsset) => {
      // Get file extension from URI or mimeType
      // Convert URI → Blob
      const fileResponse = await fetch(image.uri);
      const blob = await fileResponse.blob();

      // Build multipart form
      const formData = new FormData();
      formData.append(
        "file",
        blob,
        image.fileName || `photo_${Date.now()}.jpg`
      );

      const res = await authApi.post("/api/v1/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },
    onSuccess: (response) => {
      // Invalidate any specified queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }

      // Call custom onSuccess callback
      if (options?.onSuccess) {
        options.onSuccess(response.data);
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  /**
   * Pick an image from the gallery and upload it
   */
  const pickAndUpload = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        throw new Error("Permission to access gallery is required!");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        return await upload.mutateAsync(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      throw error;
    }
  };

  /**
   * Take a photo with camera and upload it
   */
  const takePhotoAndUpload = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        throw new Error("Permission to access camera is required!");
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        return await upload.mutateAsync(result.assets[0]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      throw error;
    }
  };

  /**
   * Upload an already selected image
   */
  const uploadImage = async (image: ImagePicker.ImagePickerAsset) => {
    return await upload.mutateAsync(image);
  };

  return {
    upload: uploadImage,
    pickAndUpload,
    takePhotoAndUpload,
    isUploading: upload.isPending,
    isError: upload.isError,
    isSuccess: upload.isSuccess,
    error: upload.error,
    data: upload.data,
    reset: upload.reset,
  };
};
