/* eslint-disable prettier/prettier */
import { TextStyle, ViewStyle } from "react-native"

const $headerContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 12,
  backgroundColor: "white",
}

const $headerText: TextStyle = {
  color: "#000",
}

const $scrollContainer: ViewStyle = {
  backgroundColor: "#F5F5F5",
}

const $contentContainer: ViewStyle = {
  paddingBottom: 120,
}

const $statCardsContainer: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  paddingHorizontal: 16,
  paddingTop: 16,
}

const $statCard: ViewStyle = {
  width: "48%",
  backgroundColor: "white",
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
}

const $statValue: TextStyle = {
  fontSize: 22,
  fontWeight: "bold",
  color: "#000",
  marginVertical: 8,
}

const $statLabel: TextStyle = {
  fontSize: 16,
  color: "#666",
}

const $chartContainer: ViewStyle = {
  backgroundColor: "white",
  borderRadius: 12,
  marginHorizontal: 16,
  marginBottom: 20,
  padding: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
}

const $chartHeader: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
}

const $chartTitle: TextStyle = {
  fontSize: 20,
  fontWeight: "bold",
  color: "#000",
}

const $pieChartContainer: ViewStyle = {
  marginVertical: 20,
}

const $simplifiedChart: ViewStyle = {
  padding: 10,
}

const $legendItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginRight: 16,
  marginBottom: 8,
  padding: 4,
}

const $legendColor: ViewStyle = {
  width: 12,
  height: 12,
  borderRadius: 6,
  marginRight: 6,
}

const $legendText: TextStyle = {
  fontSize: 14,
  color: "#666",
  marginRight: 8,
}

const $legendPercent: TextStyle = {
  fontSize: 14,
  fontWeight: "bold",
  color: "#333",
}

const $barChartContainer: ViewStyle = {
  height: 200,
  marginTop: 16,
}

const $barChartContent: ViewStyle = {
  flex: 1,
  height: "100%",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "flex-end",
  paddingHorizontal: 10,
}

const $barGroup: ViewStyle = {
  alignItems: "center",
}

const $barColumn: ViewStyle = {
  flexDirection: "row",
  height: 150,
  alignItems: "flex-end",
}

const $bar: ViewStyle = {
  width: 15,
  borderTopLeftRadius: 3,
  borderTopRightRadius: 3,
}

const $barLabel: TextStyle = {
  fontSize: 14,
  color: "#666",
  marginTop: 4,
}

const $barLegendContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  marginTop: 16,
}

const $periodSelector: ViewStyle = {
  flexDirection: "row",
  borderRadius: 8,
  overflow: "hidden",
  borderWidth: 1,
  borderColor: "#DDD",
}

const $periodButton: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 6,
  backgroundColor: "#F5F5F5",
}

const $periodButtonActive: ViewStyle = {
  backgroundColor: "#007AFF",
}

const $periodButtonText: TextStyle = {
  fontSize: 14,
  color: "#666",
}

const $periodButtonTextActive: TextStyle = {
  color: "white",
  fontWeight: "bold",
}

const $alertContainer: ViewStyle = {
  marginHorizontal: 16,
  marginBottom: 20,
}

const $alertSection: ViewStyle = {
  backgroundColor: "white",
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
}

const $alertTitle: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  color: "#000",
  marginBottom: 12,
}

const $alertItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#EEE",
}

const $alertIconContainer: ViewStyle = {
  marginRight: 12,
}

const $alertContent: ViewStyle = {
  flex: 1,
}

const $alertItemName: TextStyle = {
  fontSize: 16,
  fontWeight: "600",
  color: "#000",
}

const $alertItemDetails: TextStyle = {
  fontSize: 14,
  color: "#666",
}

const $alertAction: ViewStyle = {
  padding: 8,
}

const $footer: ViewStyle = {
  alignItems: "center",
  paddingVertical: 20,
  borderTopWidth: 1,
  borderTopColor: "#EEE",
}

const $footerText: TextStyle = {
  fontSize: 14,
  color: "#666",
}

export default {
  $headerContainer,
  $alertAction,
  $footerText,
  $footer,
  $alertItemDetails,
  $alertItemName,
  $alertContent,
  $alertIconContainer,
  $alertItem,
  $alertSection,
  $alertContainer,
  $periodButtonTextActive,
  $periodButtonText,
  $periodButtonActive,
  $periodButton,
  $periodSelector,
  $barLegendContainer,
  $barLabel,
  $barColumn,
  $barGroup,
  $barChartContent,
  $barChartContainer,
  $legendPercent,
  $legendText,
  $legendColor,
  $legendItem,
  $simplifiedChart,
  $pieChartContainer,
  $chartHeader,
  $chartContainer,
  $chartTitle,
  $statLabel,
  $statValue,
  $statCard,
  $statCardsContainer,
  $contentContainer,
  $scrollContainer,
  $headerText,
  $bar,
  $alertTitle,
}
