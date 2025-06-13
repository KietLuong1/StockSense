import { ChangePasswordFieldType } from "@/app/screens/ForgotPassword"
import { FieldType } from "@/app/screens/Signin"
import { axiosAccount } from "@/services/http"
import axios from "axios"
import { Alert } from "react-native"

export const loginApi = async (credentials: FieldType) => {
  try {
    console.log("Making login request to:", axiosAccount.defaults.baseURL + "/auth/login")
    console.log(
      "With credentials:",
      JSON.stringify({
        email: credentials.email,
        password: "********",
      }),
    )

    const response = await axiosAccount.post("/auth/login", credentials)
    console.log("Login successful:", response.status)
    return response.data
  } catch (error) {
    console.error("Login failed")

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status
        console.error(`Server responded with status ${status}`)
        console.error("Response data:", error.response.data)

        if (status === 403) {
          if (error.response.data?.message?.includes("expired")) {
            console.error("Token expired")
            Alert.alert("Session Expired", "Your login session has expired. Please sign in again.")
            return null
          }
        } else if (status === 401) {
          Alert.alert("Authentication Error", "Invalid username or password")
        } else if (status === 400) {
          Alert.alert("Invalid Request", "Please check your login details")
        } else {
          Alert.alert("Login Error", `Server error (${status}). Please try again later.`)
        }
      } else if (error.request) {
        console.error("No response received from server")
        Alert.alert(
          "Connection Problem",
          "The server is not responding. Please check your connection and try again.",
        )
      } else {
        console.error("Error setting up request:", error.message)
        Alert.alert("Login Error", "An unexpected error occurred. Please try again.")
      }
    } else {
      console.error("Unexpected error:", error)
    }
    return null
  }
}

// 1. Verify Email (Send OTP)
export const verifyEmail = async (email: string): Promise<string | null> => {
  try {
    console.log("Making verify email request for:", email)
    const response = await axios.post(
      `${axiosAccount.defaults.baseURL}/forgotPassword/verifyMail/${email}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        timeout: 10000,
      },
    )
    console.log("Email verification response:", response.status)
    return response.data
  } catch (error) {
    console.error("Failed to verify email", error)
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data || error.message)

      if (error.response) {
        // Server responded with an error
        if (error.response.status === 403) {
          Alert.alert(
            "Access Denied",
            "The server denied access to this endpoint. Please contact support.",
          )
        } else if (error.response.status === 404) {
          Alert.alert("Email Not Found", "This email is not registered in our system.")
        } else {
          Alert.alert("Error", "Failed to send OTP. Please try again later.")
        }
      } else if (error.request) {
        // Request was made but no response was received (network error)
        console.error("Network error - no response received")
        Alert.alert(
          "Network Error",
          "Unable to connect to the server. Please check your internet connection and try again.",
        )
      } else {
        // Something happened in setting up the request
        Alert.alert("Error", "Failed to send OTP. Please try again later.")
      }
    } else {
      // Non-axios error
      Alert.alert("Error", "An unexpected error occurred. Please try again.")
    }
    return null
  }
}

// 2. Verify OTP
export const verifyOtp = async (otp: number, email: string): Promise<string | null> => {
  try {
    console.log("Making verify OTP request:", otp, email)
    const response = await axios.post(
      `${axiosAccount.defaults.baseURL}/forgotPassword/verifyOtp/${otp}/${email}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        timeout: 10000,
      },
    )
    console.log("OTP verification response:", response.status)
    return response.data
  } catch (error) {
    console.error("Failed to verify OTP", error)
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data || error.message)

      if (error.response) {
        // Server responded with an error
        if (error.response.status === 403) {
          Alert.alert(
            "Access Denied",
            "The server denied access to this endpoint. Please contact support.",
          )
        } else if (error.response.status === 400) {
          Alert.alert("Invalid OTP", "The OTP you entered is invalid or has expired.")
        } else {
          Alert.alert("Error", "Failed to verify OTP. Please try again later.")
        }
      } else if (error.request) {
        // Request was made but no response was received (network error)
        console.error("Network error - no response received")
        Alert.alert(
          "Network Error",
          "Unable to connect to the server. Please check your internet connection and try again.",
        )
      } else {
        // Something happened in setting up the request
        Alert.alert("Error", "Failed to verify OTP. Please try again later.")
      }
    } else {
      // Non-axios error
      Alert.alert("Error", "An unexpected error occurred. Please try again.")
    }
    return null
  }
}

// 3. Change Password
export const changePassword = async (
  passwordDetails: ChangePasswordFieldType,
): Promise<string | null> => {
  try {
    console.log("Making change password request for:", passwordDetails.email)
    const response = await axios.post(
      `${axiosAccount.defaults.baseURL}/forgotPassword/changePassword/${passwordDetails.email}`,
      passwordDetails,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        timeout: 10000,
      },
    )
    console.log("Change password response:", response.status)
    return response.data
  } catch (error) {
    console.error("Failed to change password", error)
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data || error.message)

      if (error.response) {
        // Server responded with an error
        if (error.response.status === 403) {
          Alert.alert(
            "Access Denied",
            "The server denied access to this endpoint. Please contact support.",
          )
        } else if (error.response.status === 400) {
          Alert.alert("Invalid Request", "Please check your password requirements.")
        } else {
          Alert.alert("Error", "Failed to change password. Please try again later.")
        }
      } else if (error.request) {
        // Request was made but no response was received (network error)
        console.error("Network error - no response received")
        Alert.alert(
          "Network Error",
          "Unable to connect to the server. Please check your internet connection and try again.",
        )
      } else {
        // Something happened in setting up the request
        Alert.alert("Error", "Failed to change password. Please try again later.")
      }
    } else {
      // Non-axios error
      Alert.alert("Error", "An unexpected error occurred. Please try again.")
    }
    return null
  }
}
