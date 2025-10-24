import axios from "axios";
import type { AuthResponseData } from "./types/auth/authResponse";

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem("auth");
  if (storedAuth) {
    const storedAuthObj: AuthResponseData = JSON.parse(storedAuth);
    config.headers.Authorization = `Bearer ${storedAuthObj.accessToken}`;
  }
  return config;
});
