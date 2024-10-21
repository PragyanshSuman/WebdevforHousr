import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const login = async (username: string, password: string) => {
  try {
    console.log('Attempting login with:', { username, password: '****' });
    const response = await api.post('/auth/login', { username, password });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Login error:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      if (error.response?.status === 401) {
        throw new Error('Invalid username or password');
      }
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    console.error('Unexpected error:', error);
    throw error;
  }
};

export const signup = async (username: string, email: string, password: string, role: 'USER' | 'BROKER') => {
  try {
    console.log('Attempting signup with:', { username, email, role, password: '****' });
    const response = await api.post('/auth/signup', { username, email, password, role });
    console.log('Signup response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Signup error:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized: Please check your credentials or permissions');
      }
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
    console.error('Unexpected error:', error);
    throw error;
  }
};

export const getAllAccommodations = () => {
  return api.get('/accommodations');
};

export const getAccommodationById = (id: number) => {
  return api.get(`/accommodations/${id}`);
};

export const createAccommodation = (accommodationData: any) => {
  return api.post('/accommodations', accommodationData);
};

export const updateAccommodation = (id: number, accommodationData: any) => {
  return api.put(`/accommodations/${id}`, accommodationData);
};

export const deleteAccommodation = (id: number) => {
  return api.delete(`/accommodations/${id}`);
};

export const getAccommodationsByBrokerId = (brokerId: number) => {
  return api.get(`/accommodations/broker/${brokerId}`);
};

export default api;