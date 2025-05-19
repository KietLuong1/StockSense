/* eslint-disable prettier/prettier */
import { ThemedStyle } from "@/theme"
import { TextStyle, ViewStyle } from "react-native"

export const $headerContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  })
  
   export const $headerText: ThemedStyle<TextStyle> = ({ colors }) => ({
    color: colors.text,
  })
  
  export const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  })
  
  export const $contentText: ThemedStyle<TextStyle> = ({ colors }) => ({
    color: colors.textDim,
    textAlign: 'center',
  })
  
  export const $logoutButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
    backgroundColor: colors.palette.primary500,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  })

