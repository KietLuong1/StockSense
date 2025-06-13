import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform } from "react-native"
import * as SecureStore from "expo-secure-store"
import * as Device from "expo-device"
import Constants from "expo-constants"
import axios, { AxiosInstance } from "axios"
// import Config from "../../config/config.dev"

const API_LOGINSERVICE_PORT = "8080"
const API_WAREHOUSE_PORT = "8082"
const API_PATH = "/api/v1"
const FALLBACK_IP = "192.168.100.144"

export const getLoginServiceUrl = () => {
  let localIp = FALLBACK_IP

  try {
    if (Constants.expoConfig?.hostUri) {
      const hostUriParts = Constants.expoConfig.hostUri.split(":")
      if (hostUriParts.length > 0) {
        localIp = hostUriParts[0]
      }
    }
  } catch (error) {
    console.log("Error getting Expo host:", error)
  }
  console.log("===== API CONNECTION INFO =====")
  console.log("Platform:", Platform.OS)
  console.log("Physical device:", Device.isDevice)
  console.log("Local IP:", localIp)

  let baseUrl

  if (Platform.OS === "android") {
    baseUrl = Device.isDevice
      ? `http://${localIp}:${API_LOGINSERVICE_PORT}${API_PATH}`
      : `http://10.0.2.2:${API_LOGINSERVICE_PORT}${API_PATH}`
    console.log("Using Android URL:", baseUrl)
  } else {
    baseUrl = `http://localhost:${API_LOGINSERVICE_PORT}${API_PATH}`
    console.log("Using default URL:", baseUrl)
  }

  console.log("Final API URL:", baseUrl)
  console.log("=============================")
  return baseUrl
}

export const getToken = async () => {
  try {
    try {
      if (
        SecureStore &&
        typeof SecureStore.isAvailableAsync === "function" &&
        (await SecureStore.isAvailableAsync())
      ) {
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

export const refreshToken = async () => {
  try {
    let refreshToken

    try {
      if (
        SecureStore &&
        typeof SecureStore.isAvailableAsync === "function" &&
        (await SecureStore.isAvailableAsync())
      ) {
        refreshToken = await SecureStore.getItemAsync("refreshToken")
      }
    } catch (secureError) {
      console.log("SecureStore not available for refresh token, trying AsyncStorage")
    }

    if (!refreshToken) {
      refreshToken = await AsyncStorage.getItem("refreshToken")
    }

    if (!refreshToken) {
      console.error("No refresh token available")
      return null
    }

    console.log("Attempting to refresh token")
    const response = await axios.post(`${getLoginServiceUrl()}/auth/refresh`, {
      refreshToken,
    })

    console.log("Refresh response status:", response.status)
    console.log("Refresh response data:", JSON.stringify(response.data, null, 2))

    // Check for different possible response structures
    const newToken =
      response.data?.accessToken ||
      response.data?.token ||
      (typeof response.data === "string" ? response.data : null)

    if (newToken) {
      console.log("Successfully obtained new access token")

      try {
        if (
          SecureStore &&
          typeof SecureStore.isAvailableAsync === "function" &&
          (await SecureStore.isAvailableAsync())
        ) {
          await SecureStore.setItemAsync("accessToken", newToken)
        } else {
          await AsyncStorage.setItem("accessToken", newToken)
        }

        return newToken
      } catch (storageError) {
        console.error("Error saving refreshed token:", storageError)
      }
    } else {
      console.error("Refresh response did not contain a new token")
    }

    return null
  } catch (error) {
    console.error("Token refresh failed with error:")
    if (axios.isAxiosError(error)) {
      console.error("Status:", error.response?.status)
      console.error("Data:", JSON.stringify(error.response?.data, null, 2))
    } else {
      console.error(error)
    }
    return null
  }
}

export const axiosAccount = axios.create({
  baseURL: getLoginServiceUrl(),
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
  },
  timeout: 30000,
  withCredentials: true,
})

axiosAccount.interceptors.request.use(
  async (config) => {
    console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`)

    const token = await getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("Using authorization token")
    }

    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  },
)

axiosAccount.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      (error.response?.status === 403 || error.response?.status === 401) &&
      !originalRequest._retry
    ) {
      console.log("Authentication error detected, attempting to refresh token")
      originalRequest._retry = true

      try {
        const newToken = await refreshToken()

        if (newToken) {
          console.log("Token refresh successful, retrying request")
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return axiosAccount(originalRequest)
        } else {
          console.log("Token refresh successful, retrying request")
          await AsyncStorage.removeItem("accessToken")
          await AsyncStorage.removeItem("refreshToken")

          if (
            SecureStore &&
            typeof SecureStore.isAvailableAsync === "function" &&
            (await SecureStore.isAvailableAsync())
          ) {
            await SecureStore.deleteItemAsync("accessToken")
            await SecureStore.deleteItemAsync("refreshToken")
          }
        }
      } catch (refreshError) {
        console.error("Error while refreshing token:", refreshError)
      }
    }

    if (error.response) {
      console.error(`Server responded with status ${error.response.status}`)
      console.error("Response data:", JSON.stringify(error.response.data, null, 2))
    } else if (error.request) {
      console.error("No response received from server")
    } else {
      console.error("Error setting up request:", error.message)
    }

    return Promise.reject(error)
  },
)

export const getWarehouseUrl = () => {
  let localIp = FALLBACK_IP

  try {
    if (Constants.expoConfig?.hostUri) {
      const hostUriParts = Constants.expoConfig.hostUri.split(":")
      if (hostUriParts.length > 0) {
        localIp = hostUriParts[0]
      }
    }
  } catch (error) {
    console.log("Error getting Expo host:", error)
  }
  console.log("===== WAREHOUSE CONNECTION INFO =====")
  console.log("Platform:", Platform.OS)
  console.log("Physical device:", Device.isDevice)
  console.log("Local IP:", localIp)

  let baseUrl

  if (Platform.OS === "android") {
    baseUrl = Device.isDevice
      ? `http://${localIp}:${API_WAREHOUSE_PORT}${API_PATH}`
      : `http://10.0.2.2:${API_WAREHOUSE_PORT}${API_PATH}`
    console.log("Using Android URL:", baseUrl)
  } else {
    baseUrl = `http://localhost:${API_WAREHOUSE_PORT}${API_PATH}`
    console.log("Using default URL:", baseUrl)
  }

  console.log("Final API URL:", baseUrl)
  console.log("=============================")
  return baseUrl
}

export const warehouseAPI: AxiosInstance = axios.create({
  baseURL: getWarehouseUrl(),
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
  },
  timeout: 30000,
})

warehouseAPI.interceptors.request.use(
  async (config) => {
    const token = await getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("Using authorization token for warehouse API")
    }
    return config
  },
  (error) => Promise.reject(error),
)

warehouseAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      (error.response?.status === 403 || error.response?.status === 401) &&
      !originalRequest._retry
    ) {
      console.log("Warehouse API token expired, attempting to refresh")
      originalRequest._retry = true

      try {
        const newToken = await refreshToken()

        if (newToken) {
          console.log("Token refresh successful, retrying request")
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return warehouseAPI(originalRequest)
        } else {
          console.log("Refresh failed — clearing tokens")
          await AsyncStorage.removeItem("accessToken")
          await AsyncStorage.removeItem("refreshToken")

          if (
            SecureStore &&
            typeof SecureStore.isAvailableAsync === "function" &&
            (await SecureStore.isAvailableAsync())
          ) {
            await SecureStore.deleteItemAsync("accessToken")
            await SecureStore.deleteItemAsync("refreshToken")
          }
        }
      } catch (refreshError) {
        console.error("Warehouse token refresh error:", refreshError)
      }
    }

    if (error.response) {
      console.error(`Server responded with status ${error.response.status}`)
      console.error("Response data:", JSON.stringify(error.response.data, null, 2))
    } else if (error.request) {
      console.error("No response received from server")
    } else {
      console.error("Error setting up request:", error.message)
    }

    return Promise.reject(error)
  },
)
