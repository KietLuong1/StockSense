/* eslint-disable prettier/prettier */

import { Screen, Text } from "@/components"
import { TransactionKey } from "@/queries/Transaction/key"
import { transactionMockData } from "@/queries/Transaction/mockData"
import { useAppTheme } from "@/utils/useAppTheme"
import { FontAwesome } from "@expo/vector-icons"
import { useEffect, useState } from "react"
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
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import styles from "./styles"

const locations = ["All", "Warehouse A", "Warehouse B", "Warehouse C", "Store A", "Store B"]

export default function Transaction() {
  const { themed, theme } = useAppTheme()

  const insets = useSafeAreaInsets()

  const [transactions, setTransactions] = useState([...transactionMockData])
  const [filteredTransactions, setFilteredTransactions] = useState([...transactionMockData])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sortBy, setSortBy] = useState<TransactionKey>(TransactionKey.ID)
  const [filterModalVisible, setFilterModalVisible] = useState(false)

  const [tempLocation, setTempLocation] = useState("All")
  const [tempSortBy, setTempSortBy] = useState<TransactionKey>(TransactionKey.ID)
  const [tempSortOrder, setTempSortOrder] = useState<"asc" | "desc">("asc")

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
    setTempLocation("All")
    setTempSortBy(TransactionKey.ID)
    setTempSortOrder("asc")
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString()
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setTransactions([...transactionMockData])
      } catch (error) {
        console.error("Error fetching transactions:", error)
        Alert.alert("Error", "Failed to load transaction data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  useEffect(() => {
    let filtered = [...transactions]

    if (selectedLocation !== "All") {
      filtered = filtered.filter((item) => item[TransactionKey.LOCATION] === selectedLocation)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) => {
        const product = String(item[TransactionKey.PRODUCT]).toLowerCase()
        const batchId = String(item[TransactionKey.BATCH_ID]).toLowerCase()
        const id = String(item[TransactionKey.ID]).toLowerCase()
        return product.includes(query) || batchId.includes(query) || id.includes(query)
      })
    }

    filtered.sort((a, b) => {
      let valueA = a[sortBy]
      let valueB = b[sortBy]

      if (sortBy === TransactionKey.EXPIRED_DATE) {
        valueA = new Date(valueA).getTime()
        valueB = new Date(valueB).getTime()
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase()
        valueB = valueB.toLowerCase()
        return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
      }

      return sortOrder === "asc" ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA)
    })

    setFilteredTransactions(filtered)
  }, [transactions, searchQuery, selectedLocation, sortOrder, sortBy])

  const onRefresh = async () => {
    setRefreshing(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTransactions([...transactionMockData])
    } catch (error) {
      console.error("Error refreshing transactions:", error)
      Alert.alert("Error", "Failed to refresh transaction data")
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
        style={themed(styles.$itemContainer)}
        onPress={() =>
          Alert.alert(
            productName,
            `ID: ${item[TransactionKey.ID]}\nBatch: ${batchId}\nLocation: ${location}\nQuantity: ${quantity}\nExpiry: ${formatDate(expiredDate)}`,
          )
        }
      >
        <View style={themed(styles.$itemContent)}>
          <View style={themed(styles.$itemHeader)}>
            <Text style={themed(styles.$itemName)}>{productName}</Text>
            <Text style={themed(styles.$itemQuantity)}>Qty: {quantity}</Text>
          </View>

          <View style={themed(styles.$itemDetails)}>
            <Text style={themed(styles.$itemId)}>ID: {item[TransactionKey.ID]}</Text>
            <Text style={themed(styles.$itemBatch)}>Batch: {batchId}</Text>
          </View>

          <View style={themed(styles.$itemDetails)}>
            <Text style={themed(styles.$itemLocation)} numberOfLines={1} ellipsizeMode="tail">
              {location}
            </Text>
            <Text style={themed(styles.$itemDate)}>Expiry: {formatDate(expiredDate)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderEmptyList = () => {
    if (isLoading) return null

    return (
      <View style={themed(styles.$emptyContainer)}>
        <FontAwesome name="exchange" size={50} color={theme.colors.palette.neutral400} />
        <Text style={themed(styles.$emptyText)}>
          {searchQuery || selectedLocation !== "All"
            ? "No matching transactions found"
            : "No transactions available"}
        </Text>
        <TouchableOpacity style={themed(styles.$emptyButton)} onPress={onRefresh}>
          <Text style={themed(styles.$emptyButtonText)}>Refresh</Text>
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
          <View style={themed(styles.$modalOverlay)}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={themed(styles.$filterModalContainer)}>
                <View style={themed(styles.$filterModalHeader)}>
                  <Text style={themed(styles.$filterModalTitle)}>Filter Transactions</Text>
                  <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                    <FontAwesome name="times" size={24} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>

                <View style={themed(styles.$filterSection)}>
                  <Text style={themed(styles.$filterSectionTitle)}>Location</Text>
                  <View style={themed(styles.$filterOptions)}>
                    {locations.map((location) => (
                      <TouchableOpacity
                        key={location}
                        style={[
                          themed(styles.$filterOption),
                          tempLocation === location && themed(styles.$filterOptionSelected),
                        ]}
                        onPress={() => setTempLocation(location)}
                      >
                        <Text
                          style={[
                            themed(styles.$filterOptionText),
                            tempLocation === location && themed(styles.$filterOptionTextSelected),
                          ]}
                        >
                          {location}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={themed(styles.$filterSection)}>
                  <Text style={themed(styles.$filterSectionTitle)}>Sort By</Text>
                  <View style={themed(styles.$filterOptions)}>
                    <TouchableOpacity
                      style={[
                        themed(styles.$filterOption),
                        tempSortBy === TransactionKey.PRODUCT &&
                          themed(styles.$filterOptionSelected),
                      ]}
                      onPress={() => setTempSortBy(TransactionKey.PRODUCT)}
                    >
                      <Text
                        style={[
                          themed(styles.$filterOptionText),
                          tempSortBy === TransactionKey.PRODUCT &&
                            themed(styles.$filterOptionTextSelected),
                        ]}
                      >
                        Product
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        themed(styles.$filterOption),
                        tempSortBy === TransactionKey.QUANTITY &&
                          themed(styles.$filterOptionSelected),
                      ]}
                      onPress={() => setTempSortBy(TransactionKey.QUANTITY)}
                    >
                      <Text
                        style={[
                          themed(styles.$filterOptionText),
                          tempSortBy === TransactionKey.QUANTITY &&
                            themed(styles.$filterOptionTextSelected),
                        ]}
                      >
                        Quantity
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        themed(styles.$filterOption),
                        tempSortBy === TransactionKey.EXPIRED_DATE &&
                          themed(styles.$filterOptionSelected),
                      ]}
                      onPress={() => setTempSortBy(TransactionKey.EXPIRED_DATE)}
                    >
                      <Text
                        style={[
                          themed(styles.$filterOptionText),
                          tempSortBy === TransactionKey.EXPIRED_DATE &&
                            themed(styles.$filterOptionTextSelected),
                        ]}
                      >
                        Expiry Date
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={themed(styles.$filterSection)}>
                  <Text style={themed(styles.$filterSectionTitle)}>Sort Order</Text>
                  <View style={themed(styles.$filterOptions)}>
                    <TouchableOpacity
                      style={[
                        themed(styles.$filterOption),
                        tempSortOrder === "asc" && themed(styles.$filterOptionSelected),
                      ]}
                      onPress={() => setTempSortOrder("asc")}
                    >
                      <Text
                        style={[
                          themed(styles.$filterOptionText),
                          tempSortOrder === "asc" && themed(styles.$filterOptionTextSelected),
                        ]}
                      >
                        Ascending
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        themed(styles.$filterOption),
                        tempSortOrder === "desc" && themed(styles.$filterOptionSelected),
                      ]}
                      onPress={() => setTempSortOrder("desc")}
                    >
                      <Text
                        style={[
                          themed(styles.$filterOptionText),
                          tempSortOrder === "desc" && themed(styles.$filterOptionTextSelected),
                        ]}
                      >
                        Descending
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={themed(styles.$filterActions)}>
                  <TouchableOpacity style={themed(styles.$resetButton)} onPress={resetFilters}>
                    <Text style={themed(styles.$resetButtonText)}>Reset</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={themed(styles.$applyButton)} onPress={applyFilters}>
                    <Text style={themed(styles.$applyButtonText)}>Apply</Text>
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
      style={styles.$root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.bottom : 0}
    >
      <Screen preset="fixed" safeAreaEdges={["top"]} style={styles.$screen}>
        <View style={themed(styles.$headerContainer)}>
          <Text preset="heading" style={themed(styles.$headerText)}>
            Transactions
          </Text>
          <View style={themed(styles.$headerActions)}>
            <TouchableOpacity style={themed(styles.$filterButton)} onPress={openFilterModal}>
              <FontAwesome name="filter" size={18} color={theme.colors.palette.neutral100} />
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={themed(styles.$addButton)}
              onPress={() => Alert.alert("New Transaction", "Add new transaction functionality")}
            >
              <FontAwesome name="plus" size={18} color={theme.colors.palette.neutral100} />
            </TouchableOpacity> */}
          </View>
        </View>

        <View style={themed(styles.$searchContainer)}>
          <View style={themed(styles.$searchBar)}>
            <FontAwesome name="search" size={16} color={theme.colors.palette.neutral500} />
            <TextInput
              style={themed(styles.$searchInput)}
              placeholder="Search product, batch..."
              placeholderTextColor={theme.colors.palette.neutral500}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <FontAwesome
                  name="times-circle"
                  size={16}
                  color={theme.colors.palette.neutral500}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {(selectedLocation !== "All" || sortBy !== TransactionKey.ID || sortOrder !== "asc") && (
          <View style={themed(styles.$filterIndicators)}>
            {selectedLocation !== "All" && (
              <View style={themed(styles.$filterTag)}>
                <Text style={themed(styles.$filterTagText)}>Location: {selectedLocation}</Text>
                <TouchableOpacity
                  onPress={() => setSelectedLocation("All")}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <FontAwesome name="times" size={12} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
            )}

            {(sortBy !== TransactionKey.ID || sortOrder !== "asc") && (
              <View style={themed(styles.$filterTag)}>
                <Text style={themed(styles.$filterTagText)}>
                  Sort:{" "}
                  {sortBy === TransactionKey.PRODUCT
                    ? "Product"
                    : sortBy === TransactionKey.QUANTITY
                      ? "Quantity"
                      : "Expiry"}{" "}
                  ({sortOrder === "asc" ? "↑" : "↓"})
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSortBy(TransactionKey.ID)
                    setSortOrder("asc")
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
          <View style={themed(styles.$loadingContainer)}>
            <ActivityIndicator size="large" color={theme.colors.palette.primary500} />
            <Text style={themed(styles.$loadingText)}>Loading transactions...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTransactions}
            renderItem={renderItem}
            keyExtractor={(item) => item[TransactionKey.ID]}
            contentContainerStyle={themed(styles.$listContent)}
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
