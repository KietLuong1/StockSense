/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { FontAwesome } from "@expo/vector-icons"
import { useState } from "react"
import { Dimensions, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"

const screenWidth = Dimensions.get('window').width;

const inventoryByCategory = [
  { category: 'Electronics', count: 35, color: '#FF5733' },
  { category: 'Clothing', count: 24, color: '#33A8FF' },
  { category: 'Food', count: 18, color: '#33FF57' },
  { category: 'Toys', count: 12, color: '#F033FF' },
  { category: 'Others', count: 8, color: '#FFDD33' },
];

const monthlyTransactions = [
  { month: 'Jan', in: 45, out: 20 },
  { month: 'Feb', in: 50, out: 35 },
  { month: 'Mar', in: 30, out: 25 },
  { month: 'Apr', in: 70, out: 40 },
  { month: 'May', in: 45, out: 30 },
  { month: 'Jun', in: 60, out: 45 },
];

// const stockTrends = [
//   { date: '01/01', level: 120 },
//   { date: '02/01', level: 150 },
//   { date: '03/01', level: 130 },
//   { date: '04/01', level: 160 },
//   { date: '05/01', level: 180 },
//   { date: '06/01', level: 170 },
//   { date: '07/01', level: 190 },
// ];

const lowStockItems = [
  { name: 'iPhone 14', quantity: 5, threshold: 10 },
  { name: 'Samsung S22', quantity: 3, threshold: 8 },
  { name: 'iPad Pro', quantity: 2, threshold: 5 },
  { name: 'AirPods Pro', quantity: 6, threshold: 15 },
];

const expiringItems = [
  { name: 'Milk', daysLeft: 2 },
  { name: 'Eggs', daysLeft: 5 },
  { name: 'Yogurt', daysLeft: 3 },
  { name: 'Bread', daysLeft: 1 },
];

export default function Dashboard() {
  const {theme } = useAppTheme()
  const [selectedPeriod, setSelectedPeriod] = useState('Week')
  
  const totalInventory = inventoryByCategory.reduce((sum, item) => sum + item.count, 0);
  
  const maxTransaction = Math.max(
    ...monthlyTransactions.map(item => Math.max(item.in, item.out))
  );

  console.log('Theme loaded:', theme ? 'yes' : 'no');
  
  const renderStatCards = () => {
      console.log('renderStatCards called');

    return (  
      <View style={$statCardsContainer}>
        <View style={$statCard}>
          <FontAwesome name="cubes" size={24} color={theme.colors.palette.primary500} />
          <Text style={$statValue}>1,240</Text>
          <Text style={$statLabel}>Total Items</Text>
        </View>
        
        <View style={$statCard}>
          <FontAwesome name="exchange" size={24} color={theme.colors.palette.accent500 } />
          <Text style={$statValue}>126</Text>
          <Text style={$statLabel}>Transactions</Text>
        </View>
        
        <View style={$statCard}>
          <FontAwesome name="warning" size={24} color={theme.colors.error} />
          <Text style={$statValue}>18</Text>
          <Text style={$statLabel}>Low Stock</Text>
        </View>
        
        <View style={$statCard}>
          <FontAwesome name="clock-o" size={24} color={theme.colors.error} />
          <Text style={$statValue}>24</Text>
          <Text style={$statLabel}>Expiring</Text>
        </View>
      </View>
    )
  }
  
  const renderSimplePieChart = () => {
    return (
      <View style={$chartContainer}>
        <View style={$chartHeader}>
          <Text style={$chartTitle}>Inventory by Category</Text>
        </View>
        
        <View style={$pieChartContainer}>
          <View style={$simplifiedChart}>
            {inventoryByCategory.map((item, index) => (
              <View key={index} style={$legendItem}>
                <View style={[$legendColor, { backgroundColor: item.color, width: 20, height: 20 }]} />
                <Text style={$legendText}>{item.category} ({item.count})</Text>
                <Text style={$legendPercent}>{Math.round((item.count / totalInventory) * 100)}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  }
  
  const renderBarChart = () => {
    const barWidth = (screenWidth - 100) / monthlyTransactions.length / 3;
    
    return (
      <View style={$chartContainer}>
        <View style={$chartHeader}>
          <Text style={$chartTitle}>Monthly Transactions</Text>
          <View style={$periodSelector}>
            {['Week', 'Month', 'Year'].map(period => (
              <TouchableOpacity
                key={period}
                style={[
                  $periodButton,
                  selectedPeriod === period && $periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text 
                  style={[
                    $periodButtonText,
                    selectedPeriod === period && $periodButtonTextActive
                  ]}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={$barChartContainer}>
          <View style={$barChartContent}>
            {monthlyTransactions.map((item, index) => (
              <View key={index} style={$barGroup}>
                <View style={$barColumn}>
                  <View 
                    style={[
                      $bar, 
                      { 
                        height: 100 * (item.in / maxTransaction),
                        backgroundColor: theme.colors.palette.primary500,
                        width: barWidth,
                      }
                    ]} 
                  />
                  <View 
                    style={[
                      $bar, 
                      { 
                        height: 100 * (item.out / maxTransaction),
                        backgroundColor: theme.colors.errorBackground || '#FF6B6B',
                        width: barWidth,
                        marginLeft: 4,
                      }
                    ]} 
                  />
                </View>
                <Text style={$barLabel}>{item.month}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={$barLegendContainer}>
          <View style={$legendItem}>
            <View style={[$legendColor, { backgroundColor: theme.colors.palette.primary500 }]} />
            <Text style={$legendText}>Items In</Text>
          </View>
          <View style={$legendItem}>
            <View style={[$legendColor, { backgroundColor: theme.colors.errorBackground || '#FF6B6B' }]} />
            <Text style={$legendText}>Items Out</Text>
          </View>
        </View>
      </View>
    )
  }
  
  const renderAlertLists = () => {
    return (
      <View style={$alertContainer}>
        <View style={$alertSection}>
          <Text style={$alertTitle}>Low Stock Items</Text>
          {lowStockItems.map((item, index) => (
            <View key={index} style={$alertItem}>
              <View style={$alertIconContainer}>
                <FontAwesome name="exclamation-triangle" size={16} color={theme.colors.palette.neutral500} />
              </View>
              <View style={$alertContent}>
                <Text style={$alertItemName}>{item.name}</Text>
                <Text style={$alertItemDetails}>
                  Qty: {item.quantity} (Min: {item.threshold})
                </Text>
              </View>
              <TouchableOpacity style={$alertAction}>
                <FontAwesome name="plus" size={16} color={theme.colors.palette.primary500} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        
        <View style={$alertSection}>
          <Text style={$alertTitle}>Expiring Soon</Text>
          {expiringItems.map((item, index) => (
            <View key={index} style={$alertItem}>
              <View style={$alertIconContainer}>
                <FontAwesome name="clock-o" size={16} color={theme.colors.error} />
              </View>
              <View style={$alertContent}>
                <Text style={$alertItemName}>{item.name}</Text>
                <Text style={$alertItemDetails}>
                  Expires in {item.daysLeft} day{item.daysLeft !== 1 ? 's' : ''}
                </Text>
              </View>
              <TouchableOpacity style={$alertAction}>
                <FontAwesome name="trash-o" size={16} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    )
  }
  
  return (
      <Screen preset="fixed" safeAreaEdges={["top"]}>
        <View style={$headerContainer}>
          <Text preset="heading" text="Dashboard" style={$headerText} />
        </View>

        <ScrollView style={$scrollContainer} contentContainerStyle={$contentContainer} showsVerticalScrollIndicator={false}>
          {renderStatCards()}
          {renderSimplePieChart()}
          {renderBarChart()}
          {renderAlertLists()}
          <View style={$footer}>
            <Text style={$footerText}>StockSense • Last updated: Today 10:45 AM</Text>
          </View>
        </ScrollView>
      </Screen>
  )
}

const $headerContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 12,
  backgroundColor: 'white',
}

const $headerText: TextStyle = {
  color: '#000',
}

const $scrollContainer: ViewStyle = {
  backgroundColor: '#F5F5F5',
}

const $contentContainer: ViewStyle = {
  paddingBottom: 120,
}

const $statCardsContainer: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingTop: 16,
}

const $statCard: ViewStyle = {
  width: '48%',
  backgroundColor: 'white',
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
}

const $statValue: TextStyle = {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#000',
  marginVertical: 8,
}

const $statLabel: TextStyle = {
  fontSize: 16,
  color: '#666',
}

const $chartContainer: ViewStyle = {
  backgroundColor: 'white',
  borderRadius: 12,
  marginHorizontal: 16,
  marginBottom: 20,
  padding: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
}

const $chartHeader: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
}

const $chartTitle: TextStyle = {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#000',
}

const $pieChartContainer: ViewStyle = {
  marginVertical: 20,
}

const $simplifiedChart: ViewStyle = {
  padding: 10,
}

// const $legendContainer: ViewStyle = {
//   flexDirection: 'row',
//   flexWrap: 'wrap',
//   justifyContent: 'center',
//   marginTop: 8,
// }

const $legendItem: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
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
  color: '#666',
  marginRight: 8,
}

const $legendPercent: TextStyle = {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#333',
}

const $barChartContainer: ViewStyle = {
  height: 200,
  marginTop: 16,
}

const $barChartContent: ViewStyle = {
  flex: 1,
  height: '100%',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'flex-end',
  paddingHorizontal: 10,
}

const $barGroup: ViewStyle = {
  alignItems: 'center',
}

const $barColumn: ViewStyle = {
  flexDirection: 'row',
  height: 150,
  alignItems: 'flex-end',
}

const $bar: ViewStyle = {
  width: 15,
  borderTopLeftRadius: 3,
  borderTopRightRadius: 3,
}

const $barLabel: TextStyle = {
  fontSize: 14,
  color: '#666',
  marginTop: 4,
}

const $barLegendContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 16,
}

const $periodSelector: ViewStyle = {
  flexDirection: 'row',
  borderRadius: 8,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: '#DDD',
}

const $periodButton: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 6,
  backgroundColor: '#F5F5F5',
}

const $periodButtonActive: ViewStyle = {
  backgroundColor: '#007AFF',
}

const $periodButtonText: TextStyle = {
  fontSize: 14,
  color: '#666',
}

const $periodButtonTextActive: TextStyle = {
  color: 'white',
  fontWeight: 'bold',
}

const $alertContainer: ViewStyle = {
  marginHorizontal: 16,
  marginBottom: 20,
}

const $alertSection: ViewStyle = {
  backgroundColor: 'white',
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
}

const $alertTitle: TextStyle = {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#000',
  marginBottom: 12,
}

const $alertItem: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#EEE',
}

const $alertIconContainer: ViewStyle = {
  marginRight: 12,
}

const $alertContent: ViewStyle = {
  flex: 1,
}

const $alertItemName: TextStyle = {
  fontSize: 16,
  fontWeight: '600',
  color: '#000',
}

const $alertItemDetails: TextStyle = {
  fontSize: 14,
  color: '#666',
}

const $alertAction: ViewStyle = {
  padding: 8,
}

const $footer: ViewStyle = {
  alignItems: 'center',
  paddingVertical: 20,
  borderTopWidth: 1,
  borderTopColor: '#EEE',
}

const $footerText: TextStyle = {
  fontSize: 14,
  color: '#666',
}