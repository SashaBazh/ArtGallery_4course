import axios from 'axios';
import { getAuthTokens, setAuthTokens, clearAuthTokens } from '../utils/auth';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

const enhancedLogger = (...args) => {
  const timestamp = new Date().toISOString();
  
  try {
    const logEntry = {
      timestamp,
      message: args.map(arg => JSON.stringify(arg)).join(' ')
    };
    const existingLogs = JSON.parse(localStorage.getItem('debug_logs') || '[]');
    existingLogs.push(logEntry);
    localStorage.setItem('debug_logs', JSON.stringify(existingLogs.slice(-50)));
  } catch (e) {}
};


const advancedSetAuthTokens = (tokens) => {
  try {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem('token_type', tokens.token_type || 'Bearer');
  } catch (error) {
    console.error('TOKEN SET ERROR:', error);
  }
};


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const logoutAndRedirect = () => {
  clearAuthTokens();
  window.location.href = '/login';
};

api.interceptors.request.use(
  (config) => {
    const tokens = getAuthTokens();
    
    if (tokens.access_token) {
      config.headers.Authorization = `${tokens.token_type} ${tokens.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const tokens = getAuthTokens();

      if (!tokens.refresh_token) {
        logoutAndRedirect();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          'http://localhost:8000/api/token/refresh',
          { refresh_token: tokens.refresh_token }
        );

        const { access_token, refresh_token, token_type } = response.data;

        if (!access_token || !refresh_token) {
          throw new Error('Invalid token response');
        }

        advancedSetAuthTokens({ 
          access_token, 
          refresh_token, 
          token_type: token_type || 'Bearer' 
        });

        processQueue(null, access_token);
        return api(originalRequest);

      } catch (err) {
        processQueue(err, null);
        logoutAndRedirect();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;