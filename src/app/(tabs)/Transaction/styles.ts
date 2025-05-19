/* eslint-disable prettier/prettier */
import { ThemedStyle } from "@/theme"
import { Platform, TextStyle, ViewStyle } from "react-native"

export const $root: ViewStyle = {
  flex: 1,
}

export const $screen: ViewStyle = {
  flex: 1,
}

export const $headerContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  })
  
  export const $headerText: ThemedStyle<TextStyle> = ({ colors }) => ({
    color: colors.text,
  })
  
  export const $headerActions: ThemedStyle<ViewStyle> = () => ({
    flexDirection: 'row',
    alignItems: 'center',
  })
  
  export const $filterButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
    backgroundColor: colors.palette.primary400,
    width: 40,
    height: 40,
    borderRadius: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  })
  
  export const $addButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
    backgroundColor: colors.palette.primary500,
    width: 40,
    height: 40,
    borderRadius: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  })
  
  // Filter indicators
  export const $filterIndicators: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  })
  
  export const $filterTag: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.palette.neutral200,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  })
  
  export const $filterTagText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
    color: colors.text,
    fontSize: 14,
    marginRight: spacing.xs,
  })
  
  // Filter modal styles
  export const $modalOverlay: ThemedStyle<ViewStyle> = () => ({
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  })
  
  export const $filterModalContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    maxHeight: '80%',
  })
  
  export const $filterModalHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  })
  
  export const $filterModalTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  })
  
  export const $filterSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    marginBottom: spacing.lg,
  })
  
  export const $filterSectionTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  })
  
  export const $filterOptions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs / 2,
  })
  
  export const $filterOption: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
    backgroundColor: colors.palette.neutral200,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.md,
    margin: spacing.xs / 2,
  })
  
  export const $filterOptionSelected: ThemedStyle<ViewStyle> = ({ colors }) => ({
    backgroundColor: colors.palette.primary500,
  })
  
  export const $filterOptionText: ThemedStyle<TextStyle> = ({ colors }) => ({
    color: colors.text,
    fontSize: 16,
  })
  
  export const $filterOptionTextSelected: ThemedStyle<TextStyle> = ({ colors }) => ({
    color: colors.palette.neutral100,
    fontWeight: 'bold',
  })
  
  export const $filterActions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  })
  
  export const $resetButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
    flex: 1,
    backgroundColor: colors.palette.neutral200,
    paddingVertical: spacing.md,
    borderRadius: spacing.md,
    alignItems: 'center',
    marginRight: spacing.sm,
  })
  
  export const $resetButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
  })
  
  export const $applyButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
    flex: 1,
    backgroundColor: colors.palette.primary500,
    paddingVertical: spacing.md,
    borderRadius: spacing.md,
    alignItems: 'center',
    marginLeft: spacing.sm,
  })
  
  export const $applyButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
    color: colors.palette.neutral100,
    fontWeight: '600',
    fontSize: 16,
  })
  
  export const $searchContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  })
  
  export const $searchBar: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.palette.neutral300,
    borderRadius: spacing.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm : 0,
  })

export const $searchInput: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  flex: 1,
  fontSize: 16,
  color: colors.text,
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.sm,
})

export const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  paddingBottom: spacing.xl * 2,
})

export const $itemContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.md,
  marginBottom: spacing.md,
  shadowColor: colors.palette.neutral800,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
  overflow: 'hidden',
})

export const $itemContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
})

export const $itemHeader: ThemedStyle<ViewStyle> = () => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
})

export const $itemName: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 20,
  fontWeight: 'bold',
  color: colors.text,
  flex: 1,
})

export const $itemDetails: ThemedStyle<ViewStyle> = () => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
})

export const $itemId: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

export const $itemQuantity: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  fontWeight: '500',
  color: colors.text,
})

export const $itemLocation: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

export const $itemBatch: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

export const $itemDate: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

export const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
})

export const $loadingText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.sm,
})

export const $emptyContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: spacing.xl,
})

export const $emptyText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  fontSize: 16, 
  textAlign: 'center',
  marginTop: spacing.md,
})

export const $emptyButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary500,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
  borderRadius: spacing.md,
  marginTop: spacing.md,
})

export const $emptyButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
  fontWeight: 'bold',
})

