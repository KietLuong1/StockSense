/* eslint-disable prettier/prettier */

import { Screen, Text } from "@/components"
import { locationNames, productNames, sampleInventoryData } from "@/queries/Inventory/mockData"
import { InventoryResponse } from "@/queries/Inventory/types"
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

const locations = ["All", ...Object.keys(locationNames).map((id) => locationNames[id])]

export default function Inventory() {
  const { themed, theme } = useAppTheme()
  const insets = useSafeAreaInsets()

  const [inventory, setInventory] = useState<InventoryResponse[]>([])
  const [filteredInventory, setFilteredInventory] = useState<InventoryResponse[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sortBy, setSortBy] = useState<keyof InventoryResponse>("product_id")
  const [filterModalVisible, setFilterModalVisible] = useState(false)

  const [tempLocation, setTempLocation] = useState("All")
  const [tempSortBy, setTempSortBy] = useState<keyof InventoryResponse>("product_id")
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
    setTempSortBy("product_id")
    setTempSortOrder("asc")
  }

  const getDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getInventoryStatus = (
    item: InventoryResponse,
  ): {
    status: "In Stock" | "Low Stock" | "Out of Stock" | "Expiring Soon" | "Expired"
    daysUntilExpiry?: number
  } => {
    const daysUntilExpiry = getDaysUntilExpiry(item.expiry_date)

    if (daysUntilExpiry < 0) {
      return { status: "Expired", daysUntilExpiry }
    }

    if (item.quantity <= 0) {
      return { status: "Out of Stock" }
    }

    if (daysUntilExpiry < 30) {
      return { status: "Expiring Soon", daysUntilExpiry }
    }

    if (item.quantity < 10) {
      return { status: "Low Stock" }
    }

    return { status: "In Stock" }
  }

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setInventory(sampleInventoryData)
      } catch (error) {
        console.error("Error fetching inventory:", error)
        Alert.alert("Error", "Failed to load inventory data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInventory()
  }, [])

  useEffect(() => {
    let filtered = [...inventory]

    if (selectedLocation !== "All") {
      const locationId = Object.entries(locationNames).find(
        ([_, name]) => name === selectedLocation,
      )?.[0]

      if (locationId) {
        filtered = filtered.filter((item) => item.location_id === locationId)
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) => {
        const productName = productNames[item.product_id]?.toLowerCase() || ""
        const batchNumber = item.batch_number.toLowerCase()
        return (
          productName.includes(query) ||
          batchNumber.includes(query) ||
          item.product_id.toLowerCase().includes(query)
        )
      })
    }

    filtered.sort((a, b) => {
      let valueA: any = a[sortBy]
      let valueB: any = b[sortBy]

      if (sortBy === "product_id") {
        valueA = productNames[a.product_id] || a.product_id
        valueB = productNames[b.product_id] || b.product_id
      }

      if (sortBy === "location_id") {
        valueA = locationNames[a.location_id] || a.location_id
        valueB = locationNames[b.location_id] || b.location_id
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase()
        valueB = valueB.toLowerCase()
        return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
      }

      return sortOrder === "asc"
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number)
    })

    setFilteredInventory(filtered)
  }, [inventory, searchQuery, selectedLocation, sortOrder, sortBy])

  const onRefresh = async () => {
    setRefreshing(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setInventory(sampleInventoryData)
    } catch (error) {
      console.error("Error refreshing inventory:", error)
      Alert.alert("Error", "Failed to refresh inventory data")
    } finally {
      setRefreshing(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "In Stock":
        return themed(styles.$inStockBadge)
      case "Low Stock":
        return themed(styles.$lowStockBadge)
      case "Expiring Soon":
        return themed(styles.$expiringSoonBadge)
      case "Expired":
        return themed(styles.$expiredBadge)
      default:
        return themed(styles.$outOfStockBadge)
    }
  }

  const renderItem = ({ item }: { item: InventoryResponse }) => {
    const { status, daysUntilExpiry } = getInventoryStatus(item)
    const productName = productNames[item.product_id] || item.product_id
    const locationName = locationNames[item.location_id] || item.location_id

    return (
      <TouchableOpacity
        style={themed(styles.$itemContainer)}
        onPress={() =>
          Alert.alert(
            productName,
            `Inventory ID: ${item.inventory_id}\nProduct ID: ${item.product_id}\nLocation: ${locationName}\nQuantity: ${item.quantity}\nBatch: ${item.batch_number}\nImported: ${formatDate(item.import_date)}\nExpiry: ${formatDate(item.expiry_date)}`,
          )
        }
      >
        <View style={themed(styles.$itemContent)}>
          <View style={themed(styles.$itemHeader)}>
            <Text style={themed(styles.$itemName)}>{productName}</Text>
            <View style={getStatusBadgeStyle(status)}>
              <Text style={themed(styles.$statusText)}>
                {status}
                {status === "Expiring Soon" && daysUntilExpiry !== undefined
                  ? ` (${daysUntilExpiry} days)`
                  : ""}
              </Text>
            </View>
          </View>

          <View style={themed(styles.$itemDetails)}>
            <Text style={themed(styles.$itemId)}>ID: {item.product_id}</Text>
            <Text style={themed(styles.$itemQuantity)}>Qty: {item.quantity}</Text>
          </View>

          <View style={themed(styles.$itemDetails)}>
            <Text style={themed(styles.$itemLocation)} numberOfLines={1} ellipsizeMode="tail">
              {locationName}
            </Text>
            <Text style={themed(styles.$itemBatch)}>Batch: {item.batch_number}</Text>
          </View>

          <View style={themed(styles.$itemFooter)}>
            <Text style={themed(styles.$itemDate)}>Import: {formatDate(item.import_date)}</Text>
            <Text
              style={[
                themed(styles.$itemDate),
                daysUntilExpiry !== undefined && daysUntilExpiry < 30
                  ? themed(styles.$expiryWarning)
                  : null,
              ]}
            >
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
      <View style={themed(styles.$emptyContainer)}>
        <FontAwesome name="inbox" size={50} color={theme.colors.palette.neutral400} />
        <Text style={themed(styles.$emptyText)}>
          {searchQuery || selectedLocation !== "All"
            ? "No matching inventory items found"
            : "No inventory items available"}
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
                  <Text style={themed(styles.$filterModalTitle)}>Filter Inventory</Text>
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
                        tempSortBy === "product_id" && themed(styles.$filterOptionSelected),
                      ]}
                      onPress={() => setTempSortBy("product_id")}
                    >
                      <Text
                        style={[
                          themed(styles.$filterOptionText),
                          tempSortBy === "product_id" && themed(styles.$filterOptionTextSelected),
                        ]}
                      >
                        Product
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        themed(styles.$filterOption),
                        tempSortBy === "quantity" && themed(styles.$filterOptionSelected),
                      ]}
                      onPress={() => setTempSortBy("quantity")}
                    >
                      <Text
                        style={[
                          themed(styles.$filterOptionText),
                          tempSortBy === "quantity" && themed(styles.$filterOptionTextSelected),
                        ]}
                      >
                        Quantity
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        themed(styles.$filterOption),
                        tempSortBy === "expiry_date" && themed(styles.$filterOptionSelected),
                      ]}
                      onPress={() => setTempSortBy("expiry_date")}
                    >
                      <Text
                        style={[
                          themed(styles.$filterOptionText),
                          tempSortBy === "expiry_date" && themed(styles.$filterOptionTextSelected),
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
            Inventory
          </Text>
          <View style={themed(styles.$headerActions)}>
            <TouchableOpacity style={themed(styles.$filterButton)} onPress={openFilterModal}>
              <FontAwesome name="filter" size={18} color={theme.colors.palette.neutral100} />
            </TouchableOpacity>

            
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

        {(selectedLocation !== "All" || sortBy !== "product_id" || sortOrder !== "asc") && (
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

            {(sortBy !== "product_id" || sortOrder !== "asc") && (
              <View style={themed(styles.$filterTag)}>
                <Text style={themed(styles.$filterTagText)}>
                  Sort:{" "}
                  {sortBy === "product_id"
                    ? "Product"
                    : sortBy === "quantity"
                      ? "Quantity"
                      : "Expiry"}{" "}
                  ({sortOrder === "asc" ? "↑" : "↓"})
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSortBy("product_id")
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
            <Text style={themed(styles.$loadingText)}>Loading inventory...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredInventory}
            renderItem={renderItem}
            keyExtractor={(item) => item.inventory_id}
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
