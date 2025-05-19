/* eslint-disable prettier/prettier */
import { ThemedStyle } from "@/theme"
import { TextStyle, ViewStyle } from "react-native"

const $headerContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  backgroundColor: colors.background,
})

const $headerText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.lg,
  backgroundColor: colors.background,
})

const $contentText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
})

const $logoutButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary500,
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 8,
})

export default { $container, $contentText, $headerContainer, $headerText, $logoutButton }
