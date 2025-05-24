/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { FontAwesome } from "@expo/vector-icons"
import { useState } from "react"
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native"
import styles from "./styles"

const screenWidth = Dimensions.get('window').width
// const screenHeight = Dimensions.get('window').height;

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

 const Dashboard = () => {
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
      <View style={styles.$statCardsContainer}>
        <View style={styles.$statCard}>
          <FontAwesome name="cubes" size={24} color={theme.colors.palette.primary500} />
          <Text style={styles.$statValue}>1,240</Text>
          <Text style={styles.$statLabel}>Total Items</Text>
        </View>
        
        <View style={styles.$statCard}>
          <FontAwesome name="exchange" size={24} color={theme.colors.palette.accent500 } />
          <Text style={styles.$statValue}>126</Text>
          <Text style={styles.$statLabel}>Transactions</Text>
        </View>
        
        <View style={styles.$statCard}>
          <FontAwesome name="warning" size={24} color={theme.colors.error} />
          <Text style={styles.$statValue}>18</Text>
          <Text style={styles.$statLabel}>Low Stock</Text>
        </View>
        
        <View style={styles.$statCard}>
          <FontAwesome name="clock-o" size={24} color={theme.colors.error} />
          <Text style={styles.$statValue}>24</Text>
          <Text style={styles.$statLabel}>Expiring</Text>
        </View>
      </View>
    )
  }
  
  const renderSimplePieChart = () => {
    return (
      <View style={styles.$chartContainer}>
        <View style={styles.$chartHeader}>
          <Text style={styles.$chartTitle}>Inventory by Category</Text>
        </View>
        
        <View style={styles.$pieChartContainer}>
          <View style={styles.$simplifiedChart}>
            {inventoryByCategory.map((item, index) => (
              <View key={index} style={styles.$legendItem}>
                <View style={[styles.$legendColor, { backgroundColor: item.color, width: 20, height: 20 }]} />
                <Text style={styles.$legendText}>{item.category} ({item.count})</Text>
                <Text style={styles.$legendPercent}>{Math.round((item.count / totalInventory) * 100)}%</Text>
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
      <View style={styles.$chartContainer}>
        <View style={styles.$chartHeader}>
          <Text style={styles.$chartTitle}>Monthly Transactions</Text>
          <View style={styles.$periodSelector}>
            {['Week', 'Month', 'Year'].map(period => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.$periodButton,
                  selectedPeriod === period && styles.$periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text 
                  style={[
                    styles.$periodButtonText,
                    selectedPeriod === period && styles.$periodButtonTextActive
                  ]}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.$barChartContainer}>
          <View style={styles.$barChartContent}>
            {monthlyTransactions.map((item, index) => (
              <View key={index} style={styles.$barGroup}>
                <View style={styles.$barColumn}>
                  <View 
                    style={[
                      styles.$bar, 
                      { 
                        height: 100 * (item.in / maxTransaction),
                        backgroundColor: theme.colors.palette.primary500,
                        width: barWidth,
                      }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.$bar, 
                      { 
                        height: 100 * (item.out / maxTransaction),
                        backgroundColor: theme.colors.errorBackground || '#FF6B6B',
                        width: barWidth,
                        marginLeft: 4,
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.$barLabel}>{item.month}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.$barLegendContainer}>
          <View style={styles.$legendItem}>
            <View style={[styles.$legendColor, { backgroundColor: theme.colors.palette.primary500 }]} />
            <Text style={styles.$legendText}>Items In</Text>
          </View>
          <View style={styles.$legendItem}>
            <View style={[styles.$legendColor, { backgroundColor: theme.colors.errorBackground || '#FF6B6B' }]} />
            <Text style={styles.$legendText}>Items Out</Text>
          </View>
        </View>
      </View>
    )
  }
  
  const renderAlertLists = () => {
    return (
      <View style={styles.$alertContainer}>
        <View style={styles.$alertSection}>
          <Text style={styles.$alertTitle}>Low Stock Items</Text>
          {lowStockItems.map((item, index) => (
            <View key={index} style={styles.$alertItem}>
              <View style={styles.$alertIconContainer}>
                <FontAwesome name="exclamation-triangle" size={16} color={theme.colors.palette.neutral500} />
              </View>
              <View style={styles.$alertContent}>
                <Text style={styles.$alertItemName}>{item.name}</Text>
                <Text style={styles.$alertItemDetails}>
                  Qty: {item.quantity} (Min: {item.threshold})
                </Text>
              </View>
              <TouchableOpacity style={styles.$alertAction}>
                <FontAwesome name="plus" size={16} color={theme.colors.palette.primary500} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        
        <View style={styles.$alertSection}>
          <Text style={styles.$alertTitle}>Expiring Soon</Text>
          {expiringItems.map((item, index) => (
            <View key={index} style={styles.$alertItem}>
              <View style={styles.$alertIconContainer}>
                <FontAwesome name="clock-o" size={16} color={theme.colors.error} />
              </View>
              <View style={styles.$alertContent}>
                <Text style={styles.$alertItemName}>{item.name}</Text>
                <Text style={styles.$alertItemDetails}>
                  Expires in {item.daysLeft} day{item.daysLeft !== 1 ? 's' : ''}
                </Text>
              </View>
              <TouchableOpacity style={styles.$alertAction}>
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
        <View style={styles.$headerContainer}>
          <Text preset="heading" text="Dashboard" style={styles.$headerText} />
        </View>

        <ScrollView style={styles.$scrollContainer} contentContainerStyle={styles.$contentContainer} showsVerticalScrollIndicator={false}>
          {renderStatCards()}
          {renderSimplePieChart()}
          {renderBarChart()}
          {renderAlertLists()}
          <View style={styles.$footer}>
            <Text style={styles.$footerText}>StockSense • Last updated: Today 10:45 AM</Text>
          </View>
        </ScrollView>
      </Screen>
  )
}

export default Dashboard