import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const api = axios.create({
  baseURL:
    Platform.OS === "android"
      ? "http://10.0.2.2:3000/api"
      : "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem("sessionToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("sessionToken");
    }
    return Promise.reject(error);
  }
);

export default api;
