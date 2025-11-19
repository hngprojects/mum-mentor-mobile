// src/core/services/apiClient.ts

import axios from 'axios';
// import { getAuthToken } from '../utils/authStorage'; // <-- Will be implemented next

// --- API BASE URL ---
// Assuming the root API endpoint is available via environment variable 
// or hardcoded constant. For this project, the base is kaizen.emerj.net.
const BASE_URL = 'https://kaizen.emerj.net/api/v1'; 

// Create a core Axios instance for making API requests.
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Timeout after 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
// --- FUTURE STEP: JWT INTERCEPTORS ---
// We will implement an interceptor here in the next sprint to automatically 
// attach the JWT for every authenticated request, which is required for 
// accessing protected routes (like milestones or user data).

apiClient.interceptors.request.use(async (config) => {
    const token = await getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
*/

// We export the client to be used by all service files (authService.ts, taskService.ts, etc.)
export default apiClient;