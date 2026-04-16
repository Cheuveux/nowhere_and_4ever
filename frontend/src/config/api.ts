// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337/api';

// Helper function to construct API endpoints
export const getEndpoint = (path: string): string => {
  return `${API_BASE_URL}${path}`;
};
