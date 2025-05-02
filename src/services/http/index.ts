/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { Platform } from "react-native"
import * as SecureStore from "expo-secure-store"
import * as Device from 'expo-device'
import Constants from 'expo-constants'

const API_PORT = "8080"
const API_PATH = "/api/v1"
const FALLBACK_IP = "192.168.100.144"

export const getBaseUrl = () => {
  let localIp = FALLBACK_IP; 
  
  try {
    if (Constants.expoConfig?.hostUri) {
      const hostUriParts = Constants.expoConfig.hostUri.split(':');
      if (hostUriParts.length > 0) {
        localIp = hostUriParts[0];
      }
    }
  } catch (error) {
    console.log("Error getting Expo host:", error);
  }

  console.log("===== API CONNECTION INFO =====");
  console.log("Platform:", Platform.OS);
  console.log("Physical device:", Device.isDevice);
  console.log("Local IP:", localIp);
  
  let baseUrl;
  
  if (Platform.OS === 'android') {
    baseUrl = Device.isDevice 
      ? `http://${localIp}:${API_PORT}${API_PATH}` 
      : `http://10.0.2.2:${API_PORT}${API_PATH}`;
    console.log("Using Android URL:", baseUrl);
  }
  else if (Platform.OS === 'ios') {
    baseUrl = Device.isDevice 
      ? `http://${localIp}:${API_PORT}${API_PATH}` 
      : `http://localhost:${API_PORT}${API_PATH}`;
    console.log("Using iOS URL:", baseUrl);
  }
  else {
    baseUrl = `http://localhost:${API_PORT}${API_PATH}`;
    console.log("Using default URL:", baseUrl);
  }
  
  console.log("Final API URL:", baseUrl);
  console.log("=============================");
  return baseUrl;
}

export const getToken = async () => {
  try {
    try {
      if (SecureStore && typeof SecureStore.isAvailableAsync === 'function' && await SecureStore.isAvailableAsync()) {
        return await SecureStore.getItemAsync("accessToken")
      }
    } catch (secureError) {
      console.log("SecureStore not available, falling back to AsyncStorage")
    }
    
    return await AsyncStorage.getItem("accessToken")
  } catch (e) {
    console.error("Error retrieving token:", e)
    return null
  }
}

export const axiosAccount = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
  },
  timeout: 30000,
  withCredentials: true
})

axiosAccount.interceptors.request.use(
  async (config) => {
    console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    const token = await getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("Using authorization token");
    }
    
    return config
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error)
  }
)

axiosAccount.interceptors.response.use(
  (response) => {
    console.log(`Response: ${response.status} ${response.statusText}`);
    return response
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      console.error(`API Error ${status}:`, error.response.data);
      
      if (status === 403) {
        console.error("403 FORBIDDEN - Access denied. This could be due to:");
        console.error("1. Invalid or expired authentication token");
        console.error("2. Insufficient permissions for this request");
        console.error("3. CORS policy restrictions on the server");
        console.error("4. IP address restrictions on the server");
      } else if (status === 401) {
        console.error("401 UNAUTHORIZED - Authentication required");
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    
    return Promise.reject(error);
  }
)

export const testApiConnection = async () => {
  try {
    const url = `${getBaseUrl()}/health`;
    console.log("Testing API connectivity to:", url);
    
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
    
    console.log("Connection successful:", response.status, response.statusText);
    return true;
  } catch (error: any) {
    console.error("Connection test failed:", error.message);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Status:", error.response.status);
      console.error("Status Text:", error.response.statusText);
      console.error("Data:", error.response.data);
    }
    return false;
  }
}