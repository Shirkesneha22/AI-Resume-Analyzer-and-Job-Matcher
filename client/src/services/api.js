import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for Gemini processing
});

export const fetchHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export const fetchRoles = async () => {
  const response = await apiClient.get('/roles');
  return response.data.roles;
};

export const generateJobDescription = async (role) => {
  const response = await apiClient.post('/generate-jd', { role });
  return response.data;
};

export const analyzeResumeApi = async (formData, onProgress) => {
  const response = await apiClient.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });
  return response.data;
};

export default apiClient;
