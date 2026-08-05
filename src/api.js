import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

const cache = new Map();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Cache GET requests
api.interceptors.request.use((config) => {
  if (config.method === 'get') {
    const cachedResponse = cache.get(config.url);
    if (cachedResponse) {
      // Create a custom adapter that returns the cached response
      config.adapter = () => {
        return Promise.resolve({
          data: cachedResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {}
        });
      };
    }
  } else {
    // If it's a POST/PUT/DELETE, clear the cache to ensure fresh data
    if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
      cache.clear();
    }
  }
  return config;
});

api.interceptors.response.use((response) => {
  if (response.config.method === 'get') {
    cache.set(response.config.url, response.data);
  }
  return response;
});

export default api;
