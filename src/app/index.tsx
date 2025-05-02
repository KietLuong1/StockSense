/* eslint-disable prettier/prettier */
import { Button, Screen, Text } from "@/components"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { router } from "expo-router"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"

const welcomeImage = require("../../assets/images/welcome.webp")

export default function Welcome() {
  const { themed } = useAppTheme()
  const $bottomInsets = useSafeAreaInsetsStyle(["bottom"])

  const goToSignin = () => {
    router.push("/screens/Signin")
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={themed($container)}>
      <View style={themed($topSection)}>
        <Image source={welcomeImage} style={$welcomeIllustration} resizeMode="contain" />
      </View>

      <View style={[$bottomSection, $bottomInsets]}>
        <Text preset="heading" style={themed($title)}>
          Welcome to StockSense
        </Text>
        <Text style={themed($subtitle)}>
          Track, analyze, and optimize your investments with real-time market insights
        </Text>

        <View style={themed($buttonContainer)}>
          <Button
            text="Get started"
            style={themed($signInButton)}
            textStyle={themed($buttonText)}
            onPress={goToSignin}
          />
        </View>
        <Text style={themed($footerText)}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
})

const $topSection: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  justifyContent: "center",
})

const $welcomeIllustration: ImageStyle = {
  width: "100%",
  height: 300,
}

const $bottomSection: ViewStyle = {
  flex: 2,
  paddingHorizontal: 24,
  justifyContent: "flex-end",
}

const $title: ThemedStyle<TextStyle> = ({ typography }) => ({
  fontFamily: typography.primary.bold,
  fontSize: 28,
  textAlign: "center",
  marginBottom: 10,
})

const $subtitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  textAlign: "center",
  marginBottom: 35,
  color: colors.textDim,
  lineHeight: 22,
})

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
  marginBottom: spacing.xl,
})

const $signInButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary500,
  borderRadius: 12,
  height: 56,
})

// const $createAccountButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
//   backgroundColor: colors.background,
//   borderWidth: 1,
//   borderColor: colors.palette.primary500,
//   borderRadius: 12,
//   height: 56,
// })

const $buttonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
  fontSize: 16,
  fontWeight: "600",
})

// const $secondaryButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
//   color: colors.palette.primary500,
//   fontSize: 16,
//   fontWeight: "600",
// })

const $footerText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 12,
  textAlign: "center",
  color: colors.textDim,
  marginTop: spacing.sm,
})
