/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { Button, Screen, Text, TextField } from "@/components"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import { Alert, Image, ImageStyle, Pressable, TextStyle, View, ViewStyle } from "react-native"

const forgotPasswordImage = require("../../../assets/images/forgot-password.webp")

// interface ForgotPasswordProps {
//   open: boolean
//   handleClose: () => void
// }

export type ChangePasswordFieldType = {
  password: string
  repeatPassword: string
  email: string
}

export default function ForgotPassword() {
  const { themed } = useAppTheme()
  const $bottomInsets = useSafeAreaInsetsStyle(["bottom"])
  const [email, setEmail] = useState("")
  const [step, setStep] = useState(1) 
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

  const handleSendOTP = () => {
    if (!email || !email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.")
      return
    }

    console.log("Sending OTP to:", email)
    setStep(2)
  }

  const handleResetPassword = () => {
    if (!otp) {
      Alert.alert("Invalid OTP", "Please enter the OTP sent to your email.")
      return
    }

    if (!newPassword) {
      Alert.alert("Invalid Password", "Please enter a new password.")
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match. Please try again.")
      return
    }

    console.log("Resetting password with OTP:", otp)

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
  }

  const handleGoBack = () => {
    if (step === 2) {
      setStep(1)
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
              <TextField
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={{ ...themed($input), paddingLeft: 30 }}
                containerStyle={{ ...themed($inputContainer) }}
              />
            </View>
          ) : (
            <>
              <View style={themed($inputWithIconContainer)}>
                <View style={themed($iconContainer)}>
                  <MaterialCommunityIcons name="key-outline" size={20} color="#888" />
                </View>
                <TextField
                  placeholder="Enter OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ ...themed($input), paddingLeft: 30 }}
                  containerStyle={{ ...themed($inputContainer) }}
                />
              </View>

              <View style={themed($inputWithIconContainer)}>
                <View style={themed($iconContainer)}>
                  <MaterialCommunityIcons name="lock-outline" size={20} color="#888" />
                </View>
                <TextField
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ ...themed($input), paddingLeft: 30 }}
                  containerStyle={{ ...themed($inputContainer) }}
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
                <TextField
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!confirmPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ ...themed($input), paddingLeft: 30 }}
                  containerStyle={{ ...themed($inputContainer) }}
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
        </View>

        <View style={themed($actions)}>
          <Button
            text={step === 1 ? "Send OTP" : "Reset Password"}
            style={themed($resetButton)}
            textStyle={themed($buttonText)}
            onPress={step === 1 ? handleSendOTP : handleResetPassword}
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

const $actions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginTop: spacing.sm,
  marginBottom: spacing.xs,
})

const $resetButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary500,
  borderRadius: 12,
  height: 50, // Reduced from 56
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
