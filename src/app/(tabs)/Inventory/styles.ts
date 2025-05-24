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

const $filterButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary400,
  width: 40,
  height: 40,
  borderRadius: spacing.md,
  justifyContent: "center",
  alignItems: "center",
  marginRight: spacing.sm,
})

const $addButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary500,
  width: 40,
  height: 40,
  borderRadius: spacing.md,
  justifyContent: "center",
  alignItems: "center",
})

// Filter indicators
const $filterIndicators: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  paddingHorizontal: spacing.md,
  marginBottom: spacing.sm,
})

const $filterTag: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral200,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs / 2,
  borderRadius: spacing.md,
  marginRight: spacing.sm,
  marginBottom: spacing.xs,
})

const $filterTagText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  fontSize: 14,
  marginRight: spacing.xs,
})

// Filter modal styles
const $modalOverlay: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "flex-end",
})

const $filterModalContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: spacing.lg,
  maxHeight: "80%",
})

const $filterModalHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.lg,
})

const $filterModalTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 22,
  fontWeight: "bold",
  color: colors.text,
})

const $filterSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $filterSectionTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 18,
  fontWeight: "600",
  color: colors.text,
  marginBottom: 10,
})

const $filterOptions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  marginHorizontal: -spacing.xs / 2,
})

const $filterOption: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral200,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderRadius: spacing.md,
  margin: spacing.xs / 2,
})

const $filterOptionSelected: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary500,
})

const $filterOptionText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 16,
})

const $filterOptionTextSelected: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
  fontWeight: "bold",
})

const $filterActions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: spacing.md,
})

const $resetButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  backgroundColor: colors.palette.neutral200,
  paddingVertical: spacing.md,
  borderRadius: spacing.md,
  alignItems: "center",
  marginRight: spacing.sm,
})

const $resetButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontWeight: "600",
  fontSize: 16,
})

const $applyButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  backgroundColor: colors.palette.primary500,
  paddingVertical: spacing.md,
  borderRadius: spacing.md,
  alignItems: "center",
  marginLeft: spacing.sm,
})

const $applyButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
  fontWeight: "600",
  fontSize: 16,
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

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  paddingBottom: spacing.xl * 2,
})

const $itemContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.md,
  marginBottom: spacing.md,
  shadowColor: colors.palette.neutral800,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
  overflow: "hidden",
})

const $itemContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
})

const $itemHeader: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
})

const $itemName: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 20,
  fontWeight: "bold",
  color: colors.text,
  flex: 1,
})

const $statusBadge: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.sm,
  paddingVertical: 2,
  borderRadius: spacing.lg,
})

const $inStockBadge: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  ...$statusBadge({ spacing } as any),
  backgroundColor: "#90EE90",
})

const $lowStockBadge: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  ...$statusBadge({ spacing } as any),
  backgroundColor: "#FFD700",
})

const $outOfStockBadge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  ...$statusBadge({ spacing } as any),
  backgroundColor: colors.error,
})

const $expiringSoonBadge: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  ...$statusBadge({ spacing } as any),
  backgroundColor: "#FFD700",
})

const $expiredBadge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  ...$statusBadge({ spacing } as any),
  backgroundColor: colors.error,
})

const $statusText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  fontWeight: "500",
  color: 'white',
})

const $itemDetails: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 8,
})

const $itemId: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $itemQuantity: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  fontWeight: "500",
  color: colors.text,
})

const $itemLocation: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $itemBatch: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $itemFooter: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
})

const $itemDate: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $expiryWarning: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
  fontWeight: "500",
})

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $loadingText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.sm,
})

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
  $addButton,
  $applyButton,
  $applyButtonText,
  $emptyButton,
  $emptyButtonText,
  $emptyContainer,
  $emptyText,
  $expiredBadge,
  $expiringSoonBadge,
  $expiryWarning,
  $filterActions,
  $filterButton,
  $filterIndicators,
  $filterModalContainer,
  $filterModalHeader,
  $filterModalTitle,
  $filterOption,
  $filterOptions,
  $filterOptionSelected,
  $filterOptionText,
  $filterOptionTextSelected,
  $filterSection,
  $filterSectionTitle,
  $filterTag,
  $filterTagText,
  $headerActions,
  $headerContainer,
  $headerText,
  $inStockBadge,
  $itemBatch,
  $itemContainer,
  $itemContent,
  $itemDate,
  $itemDetails,
  $itemFooter,
  $itemHeader,
  $itemId,
  $itemLocation,
  $itemName,
  $itemQuantity,
  $listContent,
  $loadingContainer,
  $loadingText,
  $lowStockBadge,
  $modalOverlay,
  $outOfStockBadge,
  $resetButton,
  $resetButtonText,
  $root,
  $screen,
  $searchBar,
  $searchContainer,
  $searchInput,
  $statusBadge,
  $statusText,
}
