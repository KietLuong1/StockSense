/* eslint-disable prettier/prettier */

import { Screen, Text } from "@/components";
import { locationNames, productNames, sampleInventoryData } from "@/queries/Inventory/mockData";
import { InventoryResponse } from "@/queries/Inventory/types";
import { useAppTheme } from "@/utils/useAppTheme";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { $addButton, $applyButton, $applyButtonText, $emptyButton, $emptyButtonText, $emptyContainer, $emptyText, $expiredBadge, $expiringSoonBadge, $expiryWarning, $filterActions, $filterButton, $filterIndicators, $filterModalContainer, $filterModalHeader, $filterModalTitle, $filterOption, $filterOptions, $filterOptionSelected, $filterOptionText, $filterOptionTextSelected, $filterSection, $filterSectionTitle, $filterTag, $filterTagText, $headerActions, $headerContainer, $headerText, $inStockBadge, $itemBatch, $itemContainer, $itemContent, $itemDate, $itemDetails, $itemFooter, $itemHeader, $itemId, $itemLocation, $itemName, $itemQuantity, $listContent, $loadingContainer, $loadingText, $lowStockBadge, $modalOverlay, $outOfStockBadge, $resetButton, $resetButtonText, $root, $screen, $searchBar, $searchContainer, $searchInput, $statusBadge, $statusText } from "./styles";

const locations = ['All', ...Object.keys(locationNames).map(id => locationNames[id])];

export default function Inventory() {
  const { themed, theme } = useAppTheme()
  const insets = useSafeAreaInsets()
  
  const [inventory, setInventory] = useState<InventoryResponse[]>([])
  const [filteredInventory, setFilteredInventory] = useState<InventoryResponse[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [sortBy, setSortBy] = useState<keyof InventoryResponse>('product_id')
  const [filterModalVisible, setFilterModalVisible] = useState(false)

  const [tempLocation, setTempLocation] = useState('All')
  const [tempSortBy, setTempSortBy] = useState<keyof InventoryResponse>('product_id')
  const [tempSortOrder, setTempSortOrder] = useState<'asc' | 'desc'>('asc')
  
  
  const openFilterModal = () => {
    setTempLocation(selectedLocation)
    setTempSortBy(sortBy)
    setTempSortOrder(sortOrder)
    setFilterModalVisible(true)
  }
  
  const applyFilters = () => {
    setSelectedLocation(tempLocation)
    setSortBy(tempSortBy)
    setSortOrder(tempSortOrder)
    setFilterModalVisible(false)
  }
  
  const resetFilters = () => {
    setTempLocation('All')
    setTempSortBy('product_id')
    setTempSortOrder('asc')
  }
  
  const getDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  
  const getInventoryStatus = (item: InventoryResponse): {
    status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expiring Soon' | 'Expired';
    daysUntilExpiry?: number;
  } => {
    const daysUntilExpiry = getDaysUntilExpiry(item.expiry_date)
    
    if (daysUntilExpiry < 0) {
      return { status: 'Expired', daysUntilExpiry }
    }
    
    if (item.quantity <= 0) {
      return { status: 'Out of Stock' }
    }
    
    if (daysUntilExpiry < 30) {
      return { status: 'Expiring Soon', daysUntilExpiry }
    }
    
    if (item.quantity < 10) {
      return { status: 'Low Stock' }
    }
    
    return { status: 'In Stock' }
  }
  
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setInventory(sampleInventoryData)
      } catch (error) {
        console.error('Error fetching inventory:', error)
        Alert.alert('Error', 'Failed to load inventory data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchInventory()
  }, [])
  
  useEffect(() => {
    let filtered = [...inventory]
    
    if (selectedLocation !== 'All') {
      const locationId = Object.entries(locationNames).find(
        ([_, name]) => name === selectedLocation
      )?.[0]
      
      if (locationId) {
        filtered = filtered.filter(item => item.location_id === locationId)
      }
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => {
        const productName = productNames[item.product_id]?.toLowerCase() || ''
        const batchNumber = item.batch_number.toLowerCase()
        return productName.includes(query) || 
               batchNumber.includes(query) || 
               item.product_id.toLowerCase().includes(query)
      })
    }
    
    filtered.sort((a, b) => {
      let valueA: any = a[sortBy]
      let valueB: any = b[sortBy]
      
      if (sortBy === 'product_id') {
        valueA = productNames[a.product_id] || a.product_id
        valueB = productNames[b.product_id] || b.product_id
      }
      
      if (sortBy === 'location_id') {
        valueA = locationNames[a.location_id] || a.location_id
        valueB = locationNames[b.location_id] || b.location_id
      }
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase()
        valueB = valueB.toLowerCase()
        return sortOrder === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA)
      }
      
      return sortOrder === 'asc' 
        ? (valueA as number) - (valueB as number) 
        : (valueB as number) - (valueA as number)
    })
    
    setFilteredInventory(filtered)
  }, [inventory, searchQuery, selectedLocation, sortOrder, sortBy])
  
  const onRefresh = async () => {
    setRefreshing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setInventory(sampleInventoryData)
    } catch (error) {
      console.error('Error refreshing inventory:', error)
      Alert.alert('Error', 'Failed to refresh inventory data')
    } finally {
      setRefreshing(false)
    }
  }

  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }
  
  const renderItem = ({ item }: { item: InventoryResponse }) => {
    const { status, daysUntilExpiry } = getInventoryStatus(item)
    const productName = productNames[item.product_id] || item.product_id
    const locationName = locationNames[item.location_id] || item.location_id
    
    return (
      <TouchableOpacity 
        style={themed($itemContainer)}
        onPress={() => Alert.alert(
          productName,
          `Inventory ID: ${item.inventory_id}\nProduct ID: ${item.product_id}\nLocation: ${locationName}\nQuantity: ${item.quantity}\nBatch: ${item.batch_number}\nImported: ${formatDate(item.import_date)}\nExpiry: ${formatDate(item.expiry_date)}`
        )}
      >
        <View style={themed($itemContent)}>
          <View style={themed($itemHeader)}>
            <Text style={themed($itemName)}>{productName}</Text>
            <View style={[
              themed($statusBadge), 
              status === 'In Stock' 
                ? themed($inStockBadge) 
                : status === 'Low Stock' 
                  ? themed($lowStockBadge) 
                  : status === 'Expiring Soon'
                    ? themed($expiringSoonBadge)
                    : status === 'Expired'
                      ? themed($expiredBadge)
                      : themed($outOfStockBadge)
            ]}>
              <Text style={themed($statusText)}>
                {status}
                {status === 'Expiring Soon' && daysUntilExpiry !== undefined 
                  ? ` (${daysUntilExpiry} days)` 
                  : ''}
              </Text>
            </View>
          </View>
          
          <View style={themed($itemDetails)}>
            <Text style={themed($itemId)}>ID: {item.product_id}</Text>
            <Text style={themed($itemQuantity)}>
              Qty: {item.quantity}
            </Text>
          </View>
          
          <View style={themed($itemDetails)}>
            <Text style={themed($itemLocation)} numberOfLines={1}
            ellipsizeMode="tail">
              {locationName}
            </Text>
            <Text style={themed($itemBatch)}>
              Batch: {item.batch_number}
            </Text>
          </View>
          
          <View style={themed($itemFooter)}>
            <Text style={themed($itemDate)}>
              Import: {formatDate(item.import_date)}
            </Text>
            <Text style={[
              themed($itemDate),
              daysUntilExpiry !== undefined && daysUntilExpiry < 30 
                ? themed($expiryWarning) 
                : null
            ]}>
              Expiry: {formatDate(item.expiry_date)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  
  const renderEmptyList = () => {
    if (isLoading) return null
    
    return (
      <View style={themed($emptyContainer)}>
        <FontAwesome name="inbox" size={50} color={theme.colors.palette.neutral400} />
        <Text style={themed($emptyText)}>
          {searchQuery || selectedLocation !== 'All' 
            ? 'No matching inventory items found' 
            : 'No inventory items available'}
        </Text>
        <TouchableOpacity style={themed($emptyButton)} onPress={onRefresh}>
          <Text style={themed($emptyButtonText)}>Refresh</Text>
        </TouchableOpacity>
      </View>
    )
  }
  
  const renderFilterModal = () => {
    return (
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
          <View style={themed($modalOverlay)}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={themed($filterModalContainer)}>
                <View style={themed($filterModalHeader)}>
                  <Text style={themed($filterModalTitle)}>Filter Inventory</Text>
                  <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                    <FontAwesome name="times" size={24} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>
                
                <View style={themed($filterSection)}>
                  <Text style={themed($filterSectionTitle)}>Location</Text>
                  <View style={themed($filterOptions)}>
                    {locations.map((location) => (
                      <TouchableOpacity 
                        key={location}
                        style={[
                          themed($filterOption),
                          tempLocation === location && themed($filterOptionSelected)
                        ]}
                        onPress={() => setTempLocation(location)}
                      >
                        <Text 
                          style={[
                            themed($filterOptionText),
                            tempLocation === location && themed($filterOptionTextSelected)
                          ]}
                        >
                          {location}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={themed($filterSection)}>
                  <Text style={themed($filterSectionTitle)}>Sort By</Text>
                  <View style={themed($filterOptions)}>
                    <TouchableOpacity 
                      style={[
                        themed($filterOption),
                        tempSortBy === 'product_id' && themed($filterOptionSelected)
                      ]}
                      onPress={() => setTempSortBy('product_id')}
                    >
                      <Text 
                        style={[
                          themed($filterOptionText),
                          tempSortBy === 'product_id' && themed($filterOptionTextSelected)
                        ]}
                      >
                        Product
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        themed($filterOption),
                        tempSortBy === 'quantity' && themed($filterOptionSelected)
                      ]}
                      onPress={() => setTempSortBy('quantity')}
                    >
                      <Text 
                        style={[
                          themed($filterOptionText),
                          tempSortBy === 'quantity' && themed($filterOptionTextSelected)
                        ]}
                      >
                        Quantity
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        themed($filterOption),
                        tempSortBy === 'expiry_date' && themed($filterOptionSelected)
                      ]}
                      onPress={() => setTempSortBy('expiry_date')}
                    >
                      <Text 
                        style={[
                          themed($filterOptionText),
                          tempSortBy === 'expiry_date' && themed($filterOptionTextSelected)
                        ]}
                      >
                        Expiry Date
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={themed($filterSection)}>
                  <Text style={themed($filterSectionTitle)}>Sort Order</Text>
                  <View style={themed($filterOptions)}>
                    <TouchableOpacity 
                      style={[
                        themed($filterOption),
                        tempSortOrder === 'asc' && themed($filterOptionSelected)
                      ]}
                      onPress={() => setTempSortOrder('asc')}
                    >
                      <Text 
                        style={[
                          themed($filterOptionText),
                          tempSortOrder === 'asc' && themed($filterOptionTextSelected)
                        ]}
                      >
                        Ascending
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        themed($filterOption),
                        tempSortOrder === 'desc' && themed($filterOptionSelected)
                      ]}
                      onPress={() => setTempSortOrder('desc')}
                    >
                      <Text 
                        style={[
                          themed($filterOptionText),
                          tempSortOrder === 'desc' && themed($filterOptionTextSelected)
                        ]}
                      >
                        Descending
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={themed($filterActions)}>
                  <TouchableOpacity 
                    style={themed($resetButton)}
                    onPress={resetFilters}
                  >
                    <Text style={themed($resetButtonText)}>Reset</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={themed($applyButton)}
                    onPress={applyFilters}
                  >
                    <Text style={themed($applyButtonText)}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
 
  return (
    <KeyboardAvoidingView
      style={$root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.bottom : 0}
    >
      <Screen preset="fixed" safeAreaEdges={["top"]} style={$screen}>
        <View style={themed($headerContainer)}>
          <Text preset="heading" style={themed($headerText)}>Inventory</Text>
          <View style={themed($headerActions)}>
            <TouchableOpacity 
              style={themed($filterButton)}
              onPress={openFilterModal}
            >
              <FontAwesome name="filter" size={18} color={theme.colors.palette.neutral100} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={themed($addButton)}
              onPress={() => Alert.alert('Add Item', 'Add new inventory item functionality')}
            >
              <FontAwesome name="plus" size={18} color={theme.colors.palette.neutral100} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={themed($searchContainer)}>
          <View style={themed($searchBar)}>
            <FontAwesome name="search" size={16} color={theme.colors.palette.neutral500} />
            <TextInput
              style={themed($searchInput)}
              placeholder="Search product, batch..."
              placeholderTextColor={theme.colors.palette.neutral500}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <FontAwesome name="times-circle" size={16} color={theme.colors.palette.neutral500} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {(selectedLocation !== 'All' || sortBy !== 'product_id' || sortOrder !== 'asc') && (
          <View style={themed($filterIndicators)}>
            {selectedLocation !== 'All' && (
              <View style={themed($filterTag)}>
                <Text style={themed($filterTagText)}>
                  Location: {selectedLocation}
                </Text>
                <TouchableOpacity 
                  onPress={() => setSelectedLocation('All')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <FontAwesome name="times" size={12} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
            )}
            
            {(sortBy !== 'product_id' || sortOrder !== 'asc') && (
              <View style={themed($filterTag)}>
                <Text style={themed($filterTagText)}>
                  Sort: {sortBy === 'product_id' ? 'Product' : 
                         sortBy === 'quantity' ? 'Quantity' : 
                         'Expiry'} ({sortOrder === 'asc' ? '↑' : '↓'})
                </Text>
                <TouchableOpacity 
                  onPress={() => {
                    setSortBy('product_id')
                    setSortOrder('asc')
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <FontAwesome name="times" size={12} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        
        {isLoading ? (
          <View style={themed($loadingContainer)}>
            <ActivityIndicator size="large" color={theme.colors.palette.primary500} />
            <Text style={themed($loadingText)}>Loading inventory...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredInventory}
            renderItem={renderItem}
            keyExtractor={(item) => item.inventory_id}
            contentContainerStyle={themed($listContent)}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.palette.primary500]}
                tintColor={theme.colors.palette.primary500}
              />
            }
          />
        )}
        
        {renderFilterModal()}
      </Screen>
    </KeyboardAvoidingView>
  )
}

