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
  justifyContent: "flex-start",
  alignItems: "flex-start",
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

const $logoutTouchable: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: "100%",
  marginTop: 20,
  borderWidth: 1,
  borderRadius: 10,
  borderColor: colors.border,
})

const $logoutRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row", 
  alignItems: "center", 
  padding: spacing.md,
  width: "100%",
  justifyContent: "center",
})

const $logoutTextStyle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
  marginLeft: 10,
  fontWeight: "600",
})

const $contentHeader: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginBottom: spacing.sm,
  marginTop: spacing.sm,
  fontSize: 18,
  fontWeight: "600",
  width: "100%",
})

const $settingItem: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
  width: "100%",
})

const $settingRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})

const $settingText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  marginLeft: spacing.sm,
  fontSize: 16,
})

export default { 
  $container, 
  $contentText, 
  $headerContainer, 
  $headerText, 
  $logoutButton, 
  $logoutTouchable,
  $logoutRow,
  $logoutTextStyle,
  $contentHeader,
  $settingItem,
  $settingRow,
  $settingText
}
