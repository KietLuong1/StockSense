/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useState, useEffect, FC, ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store" 
import { axiosAccount } from "@/services/http"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  userRole?: string
  user?: UserData
  login: (token: string, userData?: UserData) => Promise<void>
  logout: () => Promise<void>
}

// Define a type for user data
interface UserData {
  userRole?: string
  userId?: string
  email?: string
  name?: string
  // Add other user properties as needed
}

// Define AuthState type
interface AuthState {
  token?: string
  userData?: UserData
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | undefined>()
  const [userRole, setUserRole] = useState<string | undefined>()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [authState, setAuthState] = useState<AuthState | null>(null);

  

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        let token
        try {
          token = await SecureStore.getItemAsync("accessToken")
        } catch (e) {
          token = await AsyncStorage.getItem("accessToken")
        }

        if (token) {
          const userDataString = await AsyncStorage.getItem("userData")
          if (userDataString) {
            const userData = JSON.parse(userDataString) as UserData
            setUser(userData)
            setUserRole(userData.userRole)
          }

          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Failed to load auth state:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadAuthState()
  }, [])

  const login = async (token: string, userData?: UserData) => {
    try {
      try {
        await SecureStore.setItemAsync("accessToken", token)
      } catch (e) {
        await AsyncStorage.setItem("accessToken", token)
      }

      if (userData) {
        await AsyncStorage.setItem("userData", JSON.stringify(userData))
        setUser(userData)
        setUserRole(userData.userRole)
      }

      setIsAuthenticated(true)
      setAuthState({
        token: token,
        userData: userData,
        isAuthenticated: true
      });
      router.replace("/(tabs)/Dashboard");        
    } catch (error) {
      console.error("Error during login:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log("Logging out user");
      setIsAuthenticated(false);
      setAuthState(null);
      setUser(undefined);
      setUserRole(undefined);
    
      if (SecureStore && typeof SecureStore.isAvailableAsync === 'function' && 
          await SecureStore.isAvailableAsync()) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      } else {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
      }
      
      delete axiosAccount.defaults.headers.common['Authorization'];
    
      // try {
      //   await axiosAccount.post('/auth/logout');
      // } catch (serverLogoutError) {
      //   console.log("Server logout failed, but continuing with client logout");
      // }
      
      console.log("Logout successful");
      router.replace("/screens/Signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        userRole,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
