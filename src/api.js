import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.config && error.config.ignoreGlobalError) {
      return Promise.reject(error);
    }

    let code = 'network';
    if (error.response) {
      code = error.response.status;
    }
    
    // Dispatch custom event for global error handling
    const event = new CustomEvent('api-error', { detail: { code } });
    window.dispatchEvent(event);
    
    return Promise.reject(error);
  }
);

export default api;
