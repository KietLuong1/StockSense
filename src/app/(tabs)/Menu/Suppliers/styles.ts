/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThemedStyle } from "@/theme"
import { Platform, TextStyle, ViewStyle } from "react-native"

const $root: ViewStyle = {
  flex: 1,
}

const $screen: ViewStyle = {
  flex: 1,
}

const $headerContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.md,
  backgroundColor: colors.background,
})

const $headerText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $headerActions: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})

const $searchContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  marginBottom: spacing.sm,
})

const $searchBar: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral300,
  borderRadius: spacing.lg,
  paddingHorizontal: spacing.sm,
  paddingVertical: Platform.OS === "ios" ? spacing.sm : 0,
})

const $searchInput: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  flex: 1,
  fontSize: 16,
  color: colors.text,
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.sm,
})

// List styles
const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  paddingBottom: spacing.xl,
})

const $itemContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.sm,
  marginBottom: spacing.md,
  overflow: "hidden",
  shadowColor: colors.palette.neutral800,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
})

const $itemContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
})

const $itemHeader: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 4,
})

const $itemName: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 18,
  fontWeight: "700",
  color: colors.text,
})

const $itemEmail: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.palette.primary400,
  fontWeight: "500",
})

const $itemDetails: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "center",
})

const $itemPhone: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
  marginRight: 10,
})

const $itemAddress: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
  flex: 1,
  marginTop: 4,
})

// Loading state
const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $loadingText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.sm,
})

// Empty state
const $emptyContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.xl,
})

const $emptyText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  fontSize: 16,
  textAlign: "center",
  marginTop: spacing.md,
})

const $emptyButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary500,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
  borderRadius: spacing.md,
  marginTop: spacing.md,
})

const $emptyButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
  fontWeight: "bold",
})

export default {
  $root,
  $screen,
  $headerContainer,
  $headerText,
  $headerActions,
  $searchContainer,
  $searchBar,
  $searchInput,
  $listContent,
  $itemContainer,
  $itemContent,
  $itemHeader,
  $itemName,
  $itemEmail,
  $itemDetails,
  $itemPhone,
  $itemAddress,
  $loadingContainer,
  $loadingText,
  $emptyContainer,
  $emptyText,
  $emptyButton,
  $emptyButtonText,
}