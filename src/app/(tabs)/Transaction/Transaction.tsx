/* eslint-disable prettier/prettier */

import { Screen, Text } from "@/components";
import { TransactionKey } from "@/queries/Transaction/key";
import { transactionMockData } from "@/queries/Transaction/mockData";
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
import { $addButton, $applyButton, $applyButtonText, $emptyButton, $emptyButtonText, $emptyContainer, $emptyText, $filterActions, $filterButton, $filterIndicators, $filterModalContainer, $filterModalHeader, $filterModalTitle, $filterOption, $filterOptions, $filterOptionSelected, $filterOptionText, $filterOptionTextSelected, $filterSection, $filterSectionTitle, $filterTag, $filterTagText, $headerActions, $headerContainer, $headerText, $itemBatch, $itemContainer, $itemContent, $itemDate, $itemDetails, $itemHeader, $itemId, $itemLocation, $itemName, $itemQuantity, $listContent, $loadingContainer, $loadingText, $modalOverlay, $resetButton, $resetButtonText, $root, $screen, $searchBar, $searchContainer, $searchInput } from "./styles";

const locations = ['All', 'Warehouse A', 'Warehouse B', 'Warehouse C', 'Store A', 'Store B'];

export default function Transaction() {
  const { themed, theme } = useAppTheme();

  const insets = useSafeAreaInsets();
  
  const [transactions, setTransactions] = useState([...transactionMockData])
  const [filteredTransactions, setFilteredTransactions] = useState([...transactionMockData])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [sortBy, setSortBy] = useState<TransactionKey>(TransactionKey.ID)
  const [filterModalVisible, setFilterModalVisible] = useState(false)

  const [tempLocation, setTempLocation] = useState('All')
  const [tempSortBy, setTempSortBy] = useState<TransactionKey>(TransactionKey.ID)
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
    setTempSortBy(TransactionKey.ID)
    setTempSortOrder('asc')
  }
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString()
  }
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setTransactions([...transactionMockData])
      } catch (error) {
        console.error('Error fetching transactions:', error)
        Alert.alert('Error', 'Failed to load transaction data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTransactions()
  }, [])
  
  useEffect(() => {
    let filtered = [...transactions]
    
    if (selectedLocation !== 'All') {
      filtered = filtered.filter(item => item[TransactionKey.LOCATION] === selectedLocation)
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => {
        const product = String(item[TransactionKey.PRODUCT]).toLowerCase()
        const batchId = String(item[TransactionKey.BATCH_ID]).toLowerCase()
        const id = String(item[TransactionKey.ID]).toLowerCase()
        return product.includes(query) || 
               batchId.includes(query) || 
               id.includes(query)
      })
    }
    
    filtered.sort((a, b) => {
      let valueA = a[sortBy]
      let valueB = b[sortBy]
      
      if (sortBy === TransactionKey.EXPIRED_DATE) {
        valueA = new Date(valueA).getTime()
        valueB = new Date(valueB).getTime()
      }
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase()
        valueB = valueB.toLowerCase()
        return sortOrder === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA)
      }
      
      return sortOrder === 'asc' 
        ? Number(valueA) - Number(valueB)
        : Number(valueB) - Number(valueA)
    })
    
    setFilteredTransactions(filtered)
  }, [transactions, searchQuery, selectedLocation, sortOrder, sortBy])
  
  const onRefresh = async () => {
    setRefreshing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTransactions([...transactionMockData])
    } catch (error) {
      console.error('Error refreshing transactions:', error)
      Alert.alert('Error', 'Failed to refresh transaction data')
    } finally {
      setRefreshing(false)
    }
  }
  
  const renderItem = ({ item }: { item: any }) => {
    const productName = item[TransactionKey.PRODUCT]
    const location = item[TransactionKey.LOCATION]
    const quantity = item[TransactionKey.QUANTITY]
    const batchId = item[TransactionKey.BATCH_ID]
    const expiredDate = item[TransactionKey.EXPIRED_DATE]
    
    return (
      <TouchableOpacity 
        style={themed($itemContainer)}
        onPress={() => Alert.alert(
          productName,
          `ID: ${item[TransactionKey.ID]}\nBatch: ${batchId}\nLocation: ${location}\nQuantity: ${quantity}\nExpiry: ${formatDate(expiredDate)}`
        )}
      >        <View style={themed($itemContent)}>
          <View style={themed($itemHeader)}>
            <Text style={themed($itemName)}>{productName}</Text>
            <Text style={themed($itemQuantity)}>
              Qty: {quantity}
            </Text>
          </View>
          
          <View style={themed($itemDetails)}>
            <Text style={themed($itemId)}>ID: {item[TransactionKey.ID]}</Text>
            <Text style={themed($itemBatch)}>
              Batch: {batchId}
            </Text>
          </View>
          
          <View style={themed($itemDetails)}>
            <Text style={themed($itemLocation)} numberOfLines={1}
            ellipsizeMode="tail">
              {location}
            </Text>
            <Text style={themed($itemDate)}>
              Expiry: {formatDate(expiredDate)}
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
        <FontAwesome name="exchange" size={50} color={theme.colors.palette.neutral400} />
        <Text style={themed($emptyText)}>
          {searchQuery || selectedLocation !== 'All' 
            ? 'No matching transactions found' 
            : 'No transactions available'}
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
                  <Text style={themed($filterModalTitle)}>Filter Transactions</Text>
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
                        tempSortBy === TransactionKey.PRODUCT && themed($filterOptionSelected)
                      ]}
                      onPress={() => setTempSortBy(TransactionKey.PRODUCT)}
                    >
                      <Text 
                        style={[
                          themed($filterOptionText),
                          tempSortBy === TransactionKey.PRODUCT && themed($filterOptionTextSelected)
                        ]}
                      >
                        Product
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        themed($filterOption),
                        tempSortBy === TransactionKey.QUANTITY && themed($filterOptionSelected)
                      ]}
                      onPress={() => setTempSortBy(TransactionKey.QUANTITY)}
                    >
                      <Text 
                        style={[
                          themed($filterOptionText),
                          tempSortBy === TransactionKey.QUANTITY && themed($filterOptionTextSelected)
                        ]}
                      >
                        Quantity
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        themed($filterOption),
                        tempSortBy === TransactionKey.EXPIRED_DATE && themed($filterOptionSelected)
                      ]}
                      onPress={() => setTempSortBy(TransactionKey.EXPIRED_DATE)}
                    >
                      <Text 
                        style={[
                          themed($filterOptionText),
                          tempSortBy === TransactionKey.EXPIRED_DATE && themed($filterOptionTextSelected)
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
          <Text preset="heading" style={themed($headerText)}>Transactions</Text>
          <View style={themed($headerActions)}>
            <TouchableOpacity 
              style={themed($filterButton)}
              onPress={openFilterModal}
            >
              <FontAwesome name="filter" size={18} color={theme.colors.palette.neutral100} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={themed($addButton)}
              onPress={() => Alert.alert('New Transaction', 'Add new transaction functionality')}
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
        
        {(selectedLocation !== 'All' || sortBy !== TransactionKey.ID || sortOrder !== 'asc') && (
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
            
            {(sortBy !== TransactionKey.ID || sortOrder !== 'asc') && (
              <View style={themed($filterTag)}>
                <Text style={themed($filterTagText)}>
                  Sort: {sortBy === TransactionKey.PRODUCT ? 'Product' : 
                         sortBy === TransactionKey.QUANTITY ? 'Quantity' : 
                         'Expiry'} ({sortOrder === 'asc' ? '↑' : '↓'})
                </Text>
                <TouchableOpacity 
                  onPress={() => {
                    setSortBy(TransactionKey.ID)
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
            <Text style={themed($loadingText)}>Loading transactions...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTransactions}
            renderItem={renderItem}
            keyExtractor={(item) => item[TransactionKey.ID]}
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

