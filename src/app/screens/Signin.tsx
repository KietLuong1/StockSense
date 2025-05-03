/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { Button, Screen, Text, TextField } from "@/components"
import { loginApi } from "@/queries/Login/api"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons"
import { useAuth } from "context/AuthContext"
import { router } from "expo-router"
import { useState } from "react"
import { Alert, Image, ImageStyle, Pressable, TextStyle, View, ViewStyle } from "react-native"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { axiosAccount } from "@/services/http"

const logoImage = require("../../../assets/images/login-1.png")

export type FieldType = {
  email: string
  password: string
  remember: boolean
}

export default function Signin() {
  const { themed } = useAppTheme()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const { login } = useAuth()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FieldType>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  })

  const onSubmit: SubmitHandler<FieldType> = async (data) => {
    try {
      // console.log("Submitting login with data:", data);
      
      const response = await loginApi(data);
      
      console.log("Response received:", response);
      
      if (!response) {
        Alert.alert("Login error", "No response from server");
        return;
      }
      
      const { accessToken } = response;
      
      if (accessToken) {
        try {
          await login(accessToken, {
            userRole: response.userRole || 'user',
            email: data.email,
          });
          
          axiosAccount.defaults.headers.Authorization = `Bearer ${accessToken}`;
          requestAnimationFrame(() => {
            try {
              // Use push instead of replace which can be less problematic
              router.push("/screens/Dashboard");
            } catch (navError) {
              console.error("Navigation error:", navError);
              // Fallback navigation method
              setTimeout(() => {
                router.navigate("/screens/Dashboard");
              }, 200);
            }
          });
          
          
        } catch (authError) {
          console.error("Auth context error:", authError);
          Alert.alert("Login Error", "Failed to save authentication data");
        }
      } else {
        Alert.alert("Login error", "Invalid credentials");
      }
    } catch (error: any) {
      console.error("Login error details:", error);
      
      if (error.message?.includes("Network Error")) {
        Alert.alert("Network Error", "Please check your internet connection");
      } else {
        Alert.alert("Login Error", "An error occurred during login");
      }
    }
  };

  const handleForgotPassword = () => {
    router.push("/screens/ForgotPassword")
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={themed($container)}>
      <View style={themed($content)}>
        <View style={themed($header)}>
          <Image source={logoImage} style={$logo} resizeMode="contain" />
          <Text preset="heading" style={themed($title)}>
            Welcome Back
          </Text>
          <Text style={themed($subtitle)}>Sign in to continue to StockSense</Text>
        </View>

        <View style={themed($form)}>
          <View style={themed($inputWithIconContainer)}>
            <View style={themed($iconContainer)}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#888" />
            </View>
            <Controller
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  placeholder="Enter your email"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  style={{ ...themed($input), paddingLeft: 30 }}
                  containerStyle={{ ...themed($inputContainer), ...themed($inputWrapper) }}
                  status={errors.email ? "error" : undefined}
                  helper={errors.email?.message}
                />
              )}
              name="email"
            />
          </View>

          <View style={themed($inputWithIconContainer)}>
            <View style={themed($iconContainer)}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#888" />
            </View>
            <Controller
              control={control}
              rules={{
                required: "Password is required",
                // minLength: { value: 6, message: "Password must be at least 6 characters" },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  placeholder="Enter your password"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ ...themed($input), paddingLeft: 30 }}
                  containerStyle={{ ...themed($inputContainer), ...themed($inputWrapper) }}
                  status={errors.password ? "error" : undefined}
                  helper={errors.password?.message}
                />
              )}
              name="password"
            />
            <Pressable style={themed($eyeIcon)} onPress={togglePasswordVisibility}>
              <FontAwesome name={passwordVisible ? "eye" : "eye-slash"} size={18} color="#888" />
            </Pressable>
          </View>

          <View style={themed($actionContainer)}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={themed($rememberContainer)}>
                <Pressable
                  style={[themed($checkbox), value && themed($checkboxSelected)]}
                  onPress={() => onChange(!value)}
                >
                  {value && <MaterialCommunityIcons name="check" size={16} color="#fff" />}
                </Pressable>
                <Text style={themed($rememberText)}>Remember me</Text>
              </View>
            )}
            name="remember"
          />
          <Pressable onPress={handleForgotPassword}>
            <Text style={themed($forgotPassword)}>Forgot Password?</Text>
          </Pressable>
          </View>
        </View>

        <View style={themed($actions)}>
          <Button
            text="Sign In"
            style={themed($signInButton)}
            textStyle={themed($buttonText)}
            onPress={handleSubmit(onSubmit)}
          />

          <View style={themed($dividerContainer)}>
            <View style={themed($divider)} />
            <Text style={themed($dividerText)}>Or continue with</Text>
            <View style={themed($divider)} />
          </View>

          <View style={themed($socialButtonsContainer)}>
            <Pressable style={themed($socialButton)}>
              <FontAwesome name="google" size={20} color="#DB4437" />
            </Pressable>
            <Pressable style={themed($socialButton)}>
              <FontAwesome name="apple" size={20} color="#000" />
            </Pressable>
            <Pressable style={themed($socialButton)}>
              <FontAwesome name="facebook" size={20} color="#4267B2" />
            </Pressable>
          </View>
        </View>
      </View>
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-between",
})

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginTop: spacing.sm,
})

const $logo: ImageStyle = {
  width: "80%",
  height: 200,
}

const $title: ThemedStyle<TextStyle> = ({ typography }) => ({
  fontFamily: typography.primary.bold,
  fontSize: 28,
  textAlign: "center",
})

const $subtitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  textAlign: "center",
  color: colors.textDim,
})

const $form: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginVertical: spacing.lg,
})

const $inputContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $input: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $inputWrapper: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.palette.neutral400,
  backgroundColor: colors.palette.neutral200,
})

const $inputWithIconContainer: ThemedStyle<ViewStyle> = () => ({
  position: "relative",
})

const $iconContainer: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  left: 12,
  top: 10,
  zIndex: 1,
})
const $eyeIcon: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  right: 16,
  top: 7,
  padding: 5,
  zIndex: 1,
})

const $forgotPassword: ThemedStyle<TextStyle> = ({ colors }) => ({
  textAlign: "right",
  color: colors.palette.primary500,
  fontSize: 14,
  marginTop: 4,
})

const $actions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginTop: spacing.sm,
  marginBottom:spacing.xl
})

const $signInButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary500,
  borderRadius: 12,
  height: 56,
  width: "100%",
  marginBottom: spacing.sm,
})

const $buttonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
  fontSize: 16,
  fontWeight: "600",
})

const $dividerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  marginTop: spacing.lg,
  marginBottom: spacing.md,
  width: "100%",
})

const $divider: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  height: 1,
  backgroundColor: colors.palette.neutral300,
})

const $dividerText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginHorizontal: spacing.xs,
  fontSize: 14,
})

const $socialButtonsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "center",
  width: "100%",
  gap: spacing.md,
})

const $socialButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 60,
  height: 60,
  borderRadius: 12,
  backgroundColor: colors.background,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  justifyContent: "center",
  alignItems: "center",
})

const $actionContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: 'row', 
  justifyContent: 'space-between',
  alignItems: 'center',
})
const $rememberContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  marginVertical: 8,
})

const $checkbox: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 20,
  height: 20,
  borderRadius: 4,
  borderWidth: 1,
  borderColor: colors.palette.neutral400,
  marginRight: 8,
  justifyContent: "center",
  alignItems: "center",
})

const $checkboxSelected: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary500,
  borderColor: colors.palette.primary500,
})

const $rememberText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})
