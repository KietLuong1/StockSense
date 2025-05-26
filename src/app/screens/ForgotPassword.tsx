/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { Button, Screen, Text, TextField } from "@/components"
import { changePassword, verifyEmail, verifyOtp } from "@/queries/Login/api"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { Alert, Image, ImageStyle, Pressable, TextStyle, View, ViewStyle } from "react-native"

const forgotPasswordImage = require("../../../assets/images/forgot-password.webp")

export type ChangePasswordFieldType = {
  password: string
  repeatPassword: string
  email: string
}

type Step1FormType = {
  email: string
}

type Step2FormType = {
  otp: string
  newPassword: string
  confirmPassword: string
}

export default function ForgotPassword() {
  const { themed } = useAppTheme()
  const $bottomInsets = useSafeAreaInsetsStyle(["bottom"])
  const [step, setStep] = useState(1)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(45) 
  const [timerActive, setTimerActive] = useState(false) 

  const {
    control: step1Control,
    handleSubmit: handleStep1Submit,
    getValues: getStep1Values,
    formState: { errors: step1Errors },
  } = useForm<Step1FormType>({
    defaultValues: {
      email: "",
    },
  })

  const {
    control: step2Control,
    handleSubmit: handleStep2Submit,
    formState: { errors: step2Errors },
    reset: resetStep2Form,
  } = useForm<Step2FormType>({
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  })
  const handleSendOTP: SubmitHandler<Step1FormType> = async (data) => {
    try {
      setIsSubmitting(true)
      const response = await verifyEmail(data.email)

      if (response) {
        console.log("OTP sent successfully:", response)
        resetStep2Form({
          otp: "",
          newPassword: "",
          confirmPassword: "",
        })
        setStep(2)
        setCountdown(45)
        setTimerActive(true)
        Alert.alert(
          "OTP Sent",
          "An OTP has been sent to your email. Please check your inbox and enter the code within 45 seconds.",
        )
      } else {
        console.log("Failed to send OTP")
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
      Alert.alert(
        "Connection Error",
        "Unable to send OTP. Please check your internet connection and try again.",
        [
          {
            text: "Retry",
            onPress: () => handleStep1Submit(handleSendOTP)(),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      setIsSubmitting(true)
      const email = getStep1Values().email
      const response = await verifyEmail(email)

      if (response) {
        setCountdown(45)
        setTimerActive(true)
        Alert.alert(
          "OTP Resent",
          "A new OTP has been sent to your email. Please check your inbox and enter the code within 45 seconds.",
        )
      } else {
        console.log("Failed to resend OTP")
      }
    } catch (error) {
      console.error("Error resending OTP:", error)
      Alert.alert(
        "Connection Error",
        "Unable to send OTP. Please check your internet connection and try again.",
        [
          {
            text: "Retry",
            onPress: handleResendOTP,
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null

    if (timerActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }, 1000)
    } else if (countdown === 0) {
      setTimerActive(false)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [timerActive, countdown])

  const handleResetPassword: SubmitHandler<Step2FormType> = async (data) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        Alert.alert("Password Mismatch", "Passwords do not match. Please try again.")
        return
      }
      if (!data.otp) {
        Alert.alert("Invalid OTP", "Please enter the OTP sent to your email.")
        return
      }

      if (!/^[0-9]{1,6}$/.test(data.otp)) {
        Alert.alert("Invalid OTP", "Please enter a valid numeric OTP.")
        return
      }

      setIsSubmitting(true)
      const otpNumber = parseInt(data.otp, 10)
      if (isNaN(otpNumber)) {
        Alert.alert("Invalid OTP", "Please enter a valid numeric OTP.")
        setIsSubmitting(false)
        return
      }
      const otpResponse = await verifyOtp(otpNumber, getStep1Values().email)

      if (!otpResponse) {
        console.log("Failed to verify OTP")
        setIsSubmitting(false)
        return
      }

      const changePasswordResponse = await changePassword({
        password: data.newPassword,
        repeatPassword: data.confirmPassword,
        email: getStep1Values().email,
      })

      if (changePasswordResponse) {
        Alert.alert(
          "Password Reset Successful",
          "Your password has been reset successfully. Please login with your new password.",
          [
            {
              text: "Login",
              onPress: () => router.push("/screens/Signin"),
            },
          ],
        )
      } else {
        Alert.alert("Error", "Failed to reset password. Please try again.")
      }
    } catch (error) {
      console.error("Error resetting password:", error)
      Alert.alert(
        "Connection Error",
        "Unable to reset password. Please check your internet connection and try again.",
        [
          {
            text: "Retry",
            onPress: () => handleStep2Submit(handleResetPassword)(),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  useEffect(() => {
    if (step === 2) {
      resetStep2Form({
        otp: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }, [step, resetStep2Form])

  const handleGoBack = () => {
    if (step === 2) {
      setStep(1)
      resetStep2Form()
      setTimerActive(false)
      setCountdown(45)
    } else {
      router.push("/screens/Signin")
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={themed($container)}>
      <View style={themed($content)}>
        <View style={themed($header)}>
          <Pressable style={themed($backButton)} onPress={handleGoBack}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </Pressable>
          <Image source={forgotPasswordImage} style={$image} resizeMode="contain" />
          <Text preset="heading" style={themed($title)}>
            {step === 1 ? "Forgot Password?" : "Reset Password"}
          </Text>
          <Text style={themed($subtitle)}>
            {step === 1
              ? "Enter your email and we'll send you an OTP to reset your password"
              : "Enter the OTP sent to your email and create a new password"}
          </Text>
        </View>

        <View style={themed($form)}>
          {step === 1 ? (
            <View style={themed($inputWithIconContainer)}>
              <View style={themed($iconContainer)}>
                <MaterialCommunityIcons name="email-outline" size={20} color="#888" />
              </View>
              <Controller
                control={step1Control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    placeholder="Email Address"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    style={{ ...themed($input), paddingLeft: 30 }}
                    containerStyle={{ ...themed($inputContainer) }}
                    status={step1Errors.email ? "error" : undefined}
                    helper={step1Errors.email?.message}
                  />
                )}
              />
            </View>
          ) : (
            <>
              <View style={themed($inputWithIconContainer)}>
                <View style={themed($iconContainer)}>
                  <MaterialCommunityIcons name="key-outline" size={20} color="#888" />
                </View>
                <Controller
                  control={step2Control}
                  name="otp"
                  rules={{
                    required: "OTP is required",
                    pattern: {
                      value: /^[0-9]{1,6}$/,
                      message: "OTP must be numeric only",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                      placeholder="Enter OTP"
                      value={value || ""}
                      onChangeText={(text) => {
                        const numericValue = text.replace(/[^0-9]/g, "")
                        if (numericValue.length <= 6) {
                          onChange(numericValue)
                        }
                      }}
                      onBlur={onBlur}
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ ...themed($input), paddingLeft: 30 }}
                      containerStyle={{ ...themed($inputContainer) }}
                      status={step2Errors.otp ? "error" : undefined}
                      helper={step2Errors.otp?.message}
                    />
                  )}
                />
              </View>
              <View style={themed($inputWithIconContainer)}>
                <View style={themed($iconContainer)}>
                  <MaterialCommunityIcons name="lock-outline" size={20} color="#888" />
                </View>
                <Controller
                  control={step2Control}
                  name="newPassword"
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                      placeholder="New Password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ ...themed($input), paddingLeft: 30 }}
                      containerStyle={{ ...themed($inputContainer) }}
                      status={step2Errors.newPassword ? "error" : undefined}
                      helper={step2Errors.newPassword?.message}
                    />
                  )}
                />
                <Pressable style={themed($eyeIcon)} onPress={togglePasswordVisibility}>
                  <MaterialCommunityIcons
                    name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#888"
                  />
                </Pressable>
              </View>
              <View style={themed($inputWithIconContainer)}>
                <View style={themed($iconContainer)}>
                  <MaterialCommunityIcons name="lock-check-outline" size={20} color="#888" />
                </View>
                <Controller
                  control={step2Control}
                  name="confirmPassword"
                  rules={{
                    required: "Confirm password is required",
                    validate: (value, formValues) =>
                      value === formValues.newPassword || "Passwords do not match",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                      placeholder="Confirm Password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!confirmPasswordVisible}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ ...themed($input), paddingLeft: 30 }}
                      containerStyle={{ ...themed($inputContainer) }}
                      status={step2Errors.confirmPassword ? "error" : undefined}
                      helper={step2Errors.confirmPassword?.message}
                    />
                  )}
                />
                <Pressable style={themed($eyeIcon)} onPress={toggleConfirmPasswordVisibility}>
                  <MaterialCommunityIcons
                    name={confirmPasswordVisible ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#888"
                  />
                </Pressable>
              </View>
            </>
          )}
          <View style={themed($otpTimerContainer)}>
            {timerActive ? (
              <Text style={themed($timerText)}>
                OTP expires in <Text style={themed($countdownText)}>{formatTime(countdown)}</Text>
              </Text>
            ) : (
              <Pressable
                onPress={handleResendOTP}
                disabled={isSubmitting}
                style={({ pressed }) => [
                  themed($resendButton),
                  pressed && { opacity: 0.7 },
                  isSubmitting && { opacity: 0.5 },
                ]}
              >
                <Text style={themed($resendButtonText)}>Resend OTP</Text>
              </Pressable>
            )}
          </View>
        </View>
        <View style={themed($actions)}>
          <Button
            text={step === 1 ? "Send OTP" : "Reset Password"}
            style={[themed($resetButton), isSubmitting && { opacity: 0.7 }]}
            textStyle={themed($buttonText)}
            onPress={
              step === 1 ? handleStep1Submit(handleSendOTP) : handleStep2Submit(handleResetPassword)
            }
            disabled={isSubmitting}
          />
        </View>

        <View style={[$footer, $bottomInsets]}>
          <View style={themed($signInContainer)}>
            <Text style={themed($signInText)}>Remember your password?</Text>
            <Pressable onPress={() => router.push("/screens/Signin")}>
              <Text style={themed($signInLink)}>Sign In</Text>
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
  paddingTop: spacing.sm,
  paddingBottom: spacing.md,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginTop: spacing.xs,
  position: "relative",
  marginBottom: spacing.xs,
})

const $backButton: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 10,
  padding: 5,
})

const $image: ImageStyle = {
  width: "80%",
  height: 200,
  marginBottom: 10,
}

const $title: ThemedStyle<TextStyle> = ({ typography }) => ({
  fontFamily: typography.primary.bold,
  fontSize: 24,
  textAlign: "center",
  marginBottom: 4,
})

const $subtitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  textAlign: "center",
  color: colors.textDim,
  marginHorizontal: 20,
  marginBottom: 10,
})

const $form: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginVertical: 0,
  marginTop: spacing.xs,
})

const $inputContainer: ThemedStyle<ViewStyle> = () => ({
  marginBottom: 10,
})

const $input: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
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
  top: "50%",
  transform: [{ translateY: -10 }],
  zIndex: 1,
})

// New styles for OTP timer and resend button
const $otpTimerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: spacing.sm,
  marginTop: 0,
})

const $timerText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $countdownText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
  fontWeight: "600",
})

const $resendButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xs,
})

const $resendButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
  fontWeight: "600",
  fontSize: 14,
})

const $actions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginTop: spacing.sm,
  marginBottom: spacing.xs,
})

const $resetButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary500,
  borderRadius: 12,
  height: 50,
  width: "100%",
})

const $buttonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
  fontSize: 16,
  fontWeight: "600",
})

const $footer: ViewStyle = {
  marginTop: 10,
}

const $signInContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
})

const $signInText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontSize: 14,
  marginRight: 4,
})

const $signInLink: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
  fontSize: 14,
  fontWeight: "600",
})
