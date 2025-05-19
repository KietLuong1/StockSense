/* eslint-disable prettier/prettier */
import { ChangePasswordFieldType } from '@/app/screens/ForgotPassword';
import { FieldType } from '@/app/screens/Signin';
import { axiosAccount } from '@/services/http';
import axios from 'axios';
import { Alert } from 'react-native';

export const loginApi = async (credentials: FieldType) => {
  try {
    console.log("Making login request to:", axiosAccount.defaults.baseURL + "/auth/login");
    console.log("With credentials:", JSON.stringify({ 
      email: credentials.email,
      password: '********' 
    }));
    
    const response = await axiosAccount.post("/auth/login", credentials);
    console.log("Login successful:", response.status);
    return response.data;
  } catch (error) {
    console.error('Login failed');
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        console.error(`Server responded with status ${status}`);
        console.error('Response data:', error.response.data);
        
        if (status === 403) {
          if (error.response.data?.message?.includes("expired")) {
            console.error('Token expired');
            Alert.alert(
              "Session Expired",
              "Your login session has expired. Please sign in again."
            );
            return null;
          }
        } else if (status === 401) {
          Alert.alert("Authentication Error", "Invalid username or password");
        } else if (status === 400) {
          Alert.alert("Invalid Request", "Please check your login details");
        } else {
          Alert.alert("Login Error", `Server error (${status}). Please try again later.`);
        }
      } else if (error.request) {
        console.error('No response received from server');
        Alert.alert(
          "Connection Problem",
          "The server is not responding. Please check your connection and try again."
        );
      } else {
        console.error('Error setting up request:', error.message);
        Alert.alert("Login Error", "An unexpected error occurred. Please try again.");
      }
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
}

// 1. Verify Email (Send OTP)
export const verifyEmail = async (email: string): Promise<string | null> => {
  try {
    console.log('Making verify email request for:', email);
    const response = await axiosAccount.post(`/forgotPassword/verifyMail/${email}`)
    return response.data
  } catch (error) {
    console.error('Failed to verify email', error)
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data || error.message)
    }
    return null
  }
}

// 2. Verify OTP
export const verifyOtp = async (otp: number, email: string): Promise<string | null> => {
  try {
    console.log('Making verify OTP request:', otp, email);
    const response = await axiosAccount.post(`/forgotPassword/verifyOtp/${otp}/${email}`)
    return response.data
  } catch (error) {
    console.error('Failed to verify OTP', error)
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data || error.message)
    }
    return null
  }
}

// 3. Change Password
export const changePassword = async (passwordDetails: ChangePasswordFieldType): Promise<string | null> => {
  try {
    console.log('Making change password request for:', passwordDetails.email);
    const response = await axiosAccount.post(
      `/forgotPassword/changePassword/${passwordDetails.email}`,
      passwordDetails
    )
    return response.data
  } catch (error) {
    console.error('Failed to change password', error)
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data || error.message)
    }
    return null
  }
}
