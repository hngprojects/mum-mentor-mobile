// core/services/childProfile.service.ts
import axios, { AxiosError } from 'axios';
import {
  ChildProfile,
  CreateChildProfileRequest,
  UpdateChildProfileRequest,
  UploadProfilePictureResponse,
  ApiError,
} from '../../types/child.types';

// Import your existing auth token function
import { getAuthToken } from './authStorage'; // ← ADJUST THIS PATH TO MATCH YOUR STRUCTURE

// Base URL - Update this with your actual API base URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.staging.kaizen.emerj.net';

// Log configuration on import
console.log('🔧 API Service Configuration:');
console.log('📍 Base URL:', API_BASE_URL);
if (API_BASE_URL === 'https://api.staging.kaizen.emerj.net') {
  console.warn('⚠️ WARNING: Using default API URL. Please set EXPO_PUBLIC_API_URL in .env file');
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    console.log('🚀 API Request Starting...');
    console.log('📍 URL:', (config.baseURL || '') + (config.url || ''));
    console.log('🔧 Method:', config.method?.toUpperCase());
    
    // Use your existing getAuthToken function
    const token = await getAuthToken();
    
    console.log('🔑 Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error('❌ No auth token found in storage!');
    }
    
    console.log('📦 Request Headers:', JSON.stringify(config.headers, null, 2));
    console.log('📦 Request Body:', JSON.stringify(config.data, null, 2));
    
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response Success');
    console.log('📍 URL:', response.config.url || 'unknown');
    console.log('📊 Status:', response.status);
    console.log('📦 Response Data:', JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    console.error('❌ API Response Error');
    if (error.response) {
      console.error('📍 URL:', error.config?.url || 'unknown');
      console.error('📊 Status:', error.response.status);
      console.error('📦 Error Data:', JSON.stringify(error.response.data, null, 2));
      console.error('📦 Error Headers:', JSON.stringify(error.response.headers, null, 2));
    }
    return Promise.reject(error);
  }
);

/**
 * Get all child profiles for the current user
 */
export const getChildProfiles = async (): Promise<ChildProfile[]> => {
  try {
    console.log('🔵 getChildProfiles: Making API request...');
    const response = await api.get<{ 
      data: { 
        children: ChildProfile[];
        total: number;
      } 
    }>('/api/v1/child-profiles/');
    
    console.log('📦 Raw API response:', JSON.stringify(response.data, null, 2));
    
    // Your API structure: { data: { children: [...], total: 0 } }
    const childrenData = response.data.data?.children || [];
    
    console.log('📦 Extracted children array:', childrenData);
    console.log('📊 Array length:', childrenData.length);
    console.log('✅ Returning children array');
    
    return childrenData;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Get a single child profile by ID
 */
export const getChildProfile = async (childId: string): Promise<ChildProfile> => {
  try {
    const response = await api.get<{ 
      data: { child: ChildProfile } | ChildProfile 
    }>(`/api/v1/child-profiles/${childId}`);
    
    // Handle nested structure { data: { child: {...} } } or { data: {...} }
    const childData = (response.data.data as any)?.child || response.data.data || response.data;
    return childData;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Create a new child profile
 */
export const createChildProfile = async (
  data: CreateChildProfileRequest
): Promise<ChildProfile> => {
  console.log('🔵 createChildProfile called');
  console.log('📝 Input data:', JSON.stringify(data, null, 2));
  
  try {
    console.log('🌐 Making POST request to /api/v1/child-profiles/');
    const response = await api.post<{ 
      data: { child: ChildProfile } | ChildProfile 
    }>('/api/v1/child-profiles/', data);
    
    console.log('📦 Raw response:', JSON.stringify(response.data, null, 2));
    
    // Handle nested structure { data: { child: {...} } } or { data: {...} }
    const childData = (response.data.data as any)?.child || response.data.data || response.data;
    console.log('✅ Child profile created successfully:', childData);
    return childData;
  } catch (error) {
    console.error('❌ Error in createChildProfile:');
    handleApiError(error);
    throw error;
  }
};

/**
 * Update an existing child profile
 */
export const updateChildProfile = async (
  childId: string,
  data: UpdateChildProfileRequest
): Promise<ChildProfile> => {
  try {
    const response = await api.patch<{ 
      data: { child: ChildProfile } | ChildProfile 
    }>(`/api/v1/child-profiles/${childId}`, data);
    
    // Handle nested structure { data: { child: {...} } } or { data: {...} }
    const childData = (response.data.data as any)?.child || response.data.data || response.data;
    return childData;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Delete a child profile
 */
export const deleteChildProfile = async (childId: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/child-profiles/${childId}`);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Upload profile picture for a child
 */
export const uploadChildProfilePicture = async (
  childId: string,
  imageFile: {
    uri: string;
    name: string;
    type: string;
  }
): Promise<UploadProfilePictureResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageFile.uri,
      name: imageFile.name,
      type: imageFile.type,
    } as any);

    const response = await api.post<{ 
      data: UploadProfilePictureResponse 
    }>(`/api/v1/child-profiles/${childId}/upload-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Handle nested structure { data: {...} }
    return response.data.data || response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Handle API errors and log them
 */
const handleApiError = (error: unknown) => {
  console.log('='.repeat(60));
  console.log('🔴 API ERROR HANDLER');
  console.log('='.repeat(60));
  
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    if (axiosError.response) {
      // Server responded with error
      console.error('📍 Error Type: Server Response Error');
      console.error('📊 Status Code:', axiosError.response.status);
      console.error('📊 Status Text:', axiosError.response.statusText);
      console.error('🔗 URL:', axiosError.config?.url || 'unknown');
      console.error('🔧 Method:', axiosError.config?.method?.toUpperCase() || 'unknown');
      console.error('📦 Response Data:', JSON.stringify(axiosError.response.data, null, 2));
      console.error('📦 Response Headers:', JSON.stringify(axiosError.response.headers, null, 2));
      
      // Log validation errors in detail
      if (axiosError.response.status === 422 && axiosError.response.data?.detail) {
        console.error('🔍 Validation Errors:');
        if (Array.isArray(axiosError.response.data.detail)) {
          axiosError.response.data.detail.forEach((err, index) => {
            console.error(`   ${index + 1}. Field: ${err.loc.join('.')}`);
            console.error(`      Message: ${err.msg}`);
            console.error(`      Type: ${err.type}`);
          });
        }
      }
      
      // Log auth errors
      if (axiosError.response.status === 401) {
        console.error('🔐 Authentication Error: Token may be invalid or expired');
      }
      
    } else if (axiosError.request) {
      // Request made but no response
      console.error('📍 Error Type: No Response from Server');
      console.error('🔗 URL:', axiosError.config?.url || 'unknown');
      console.error('📡 Request:', axiosError.request);
      console.error('💡 Possible causes:');
      console.error('   - Server is down');
      console.error('   - Network connectivity issue');
      console.error('   - CORS issue');
      console.error('   - Incorrect API URL');
    } else {
      // Error setting up request
      console.error('📍 Error Type: Request Setup Error');
      console.error('📝 Message:', axiosError.message);
      console.error('⚙️ Config:', JSON.stringify(axiosError.config, null, 2));
    }
  } else {
    console.error('📍 Error Type: Non-Axios Error');
    console.error('📝 Error:', error);
  }
  
  console.log('='.repeat(60));
};

/**
 * Helper function to format date to API format (YYYY-MM-DD)
 */
export const formatDateForApi = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Helper function to parse date from API format
 */
export const parseDateFromApi = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Helper function to calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: string): string => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  const years = today.getFullYear() - birthDate.getFullYear();
  const months = today.getMonth() - birthDate.getMonth();
  const days = today.getDate() - birthDate.getDate();
  
  let ageYears = years;
  let ageMonths = months;
  
  if (months < 0 || (months === 0 && days < 0)) {
    ageYears--;
    ageMonths = 12 + months;
  }
  
  if (ageYears > 0) {
    return `${ageYears} year${ageYears > 1 ? 's' : ''} old`;
  } else if (ageMonths > 0) {
    return `${ageMonths} month${ageMonths > 1 ? 's' : ''} old`;
  } else {
    return 'Newborn';
  }
};