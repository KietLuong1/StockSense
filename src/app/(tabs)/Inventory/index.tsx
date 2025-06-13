import { Screen, Text } from "@/components"
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
  ScrollView,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import styles from "./styles"
import { InventoryResponse } from "@/queries/Inventory/types"
import { useGetListInventory } from "@/queries/Inventory/useGetListInventory"

export default function Inventory() {
  const { themed, theme } = useAppTheme()
  const insets = useSafeAreaInsets()

  const [inventory, setInventory] = useState<InventoryResponse[]>([])
  const [filteredInventory, setFilteredInventory] = useState<InventoryResponse[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sortBy, setSortBy] = useState<string>("lastUpdated")
  const [filterModalVisible, setFilterModalVisible] = useState(false)

  const [tempSortBy, setTempSortBy] = useState<string>("lastUpdated")
  const [tempSortOrder, setTempSortOrder] = useState<"asc" | "desc">("asc")

  const { data: inventoriesData, error: inventoriesError } = useGetListInventory()

  const openFilterModal = () => {
    setTempSortBy(sortBy)
    setTempSortOrder(sortOrder)
    setFilterModalVisible(true)
  }

  const applyFilters = () => {
    setSortBy(tempSortBy)
    setSortOrder(tempSortOrder)
    setFilterModalVisible(false)
  }

  const resetFilters = () => {
    setTempSortBy("lastUpdated")
    setTempSortOrder("asc")
  }

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true)
      try {
        if (inventoriesError) {
          throw inventoriesError
        }

        if (inventoriesData) {
          setInventory(inventoriesData)
        }
      } catch (error) {
        console.error("Error fetching inventory:", error)
        Alert.alert("Error", "Failed to load inventory data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInventory()
  }, [inventoriesData, inventoriesError])

  useEffect(() => {
    let filtered = [...inventory]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) => {
        const productName = item.product.name.toLowerCase()
        const locationCode = item.locationCode.toLowerCase()
        return productName.includes(query) || locationCode.includes(query)
      })
    }

    const keyMap: Record<string, keyof InventoryResponse> = {
      id: "id",
      batchNumber: "batchNumber",
      createdAt: "createdAt",
      expiryDate: "expiryDate",
      lastCountedDate: "lastCountedDate",
      lastUpdated: "lastUpdated",
      locationCode: "locationCode",
      maxStockLevel: "maxStockLevel",
      quantityOnHand: "quantityOnHand",
      reorderLevel: "reorderLevel",
      reservedQuantity: "reservedQuantity",
      unitCost: "unitCost",
      updatedBy: "updatedBy",
    }

    filtered.sort((a, b) => {
      const mappedKey = keyMap[sortBy] ?? sortBy
      let valueA: any = a[mappedKey]
      let valueB: any = b[mappedKey]

      if (mappedKey === "lastUpdated" || mappedKey === "expiryDate") {
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

    setFilteredInventory(filtered)
  }, [inventory, searchQuery, sortOrder, sortBy])

  const onRefresh = async () => {
    setRefreshing(true)
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (inventoriesData) {
        setInventory(inventoriesData)
      }
    } catch (error) {
      console.error("Error refreshing inventory:", error)
      Alert.alert("Error", "Failed to refresh inventory data")
    } finally {
      setTimeout(() => {
        setRefreshing(false)
        setIsLoading(false)
      }, 800)
    }
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")} VND`
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const renderItem = ({ item }: { item: InventoryResponse }) => {
    return (
      <TouchableOpacity
        style={themed(styles.$itemContainer)}
        onPress={() =>
          Alert.alert(
            "Details for " + item.product.name,
            `Warehouse Name: ${item.warehouse.name}
            \nLocation Code: ${item.locationCode}
            \nQuantity on Hand: ${item.quantityOnHand}
            \nBatch Number: ${item.batchNumber}
            \nMax Stock Level: ${item.maxStockLevel}
            \nReorder Level: ${item.reorderLevel}
            \nReserved Quantity: ${item.reservedQuantity}
            \nUnit Cost: ${formatPrice(item.unitCost)}
            \nCreated At: ${formatDate(item.product.createdAt)}
            \nLast Updated: ${formatDate(item.lastUpdated)}
            \nExpiry Date: ${formatDate(item.expiryDate)}
            \nProduct description: ${item.product.description}`,
          )
        }
      >
        <View style={themed(styles.$itemContent)}>
          <View style={themed(styles.$itemHeader)}>
            <Text style={themed(styles.$itemName)} numberOfLines={1} ellipsizeMode="tail">
              {item.product.name}
            </Text>
          </View>

          <View style={themed(styles.$itemDetails)}>
            <Text style={themed(styles.$itemId)} numberOfLines={1} ellipsizeMode="tail">
              Warehouse Name: {item.warehouse.name}
            </Text>
          </View>

          <View style={themed(styles.$itemDetails)}>
            <Text style={themed(styles.$itemLocation)} numberOfLines={1} ellipsizeMode="tail">
              Location: {item.locationCode}
            </Text>
          </View>

          <View style={themed(styles.$itemDetails)}>
            <Text style={themed(styles.$itemBatch)}>Reorder Level: {item.reorderLevel}</Text>
            <Text style={themed(styles.$itemBatch)}>Max Stock Level: {item.maxStockLevel}</Text>
          </View>

          <View style={themed(styles.$itemDetails)}>
            <Text style={themed(styles.$itemBatch)}>Unit Cost: {formatPrice(item.unitCost)}</Text>
          </View>

          <View style={themed(styles.$itemDetails)}>
            <Text style={themed(styles.$itemBatch)}>Quantity: {item.quantityOnHand} </Text>
            <Text style={themed(styles.$itemDate)}>
              Last Updated: {formatDate(item.lastUpdated)}
            </Text>
            <Text style={themed(styles.$itemDate)}></Text>
          </View>

          <View style={themed(styles.$itemFooter)}>
            <Text style={themed(styles.$itemDate)}>
              Created: {formatDate(item.product.createdAt)}
            </Text>
            <Text style={themed(styles.$itemDate)}>Expiry Date: {formatDate(item.expiryDate)}</Text>
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
          {searchQuery ? "No matching inventory items found" : "No inventory items available"}
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
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={themed(styles.$filterModalContainer)}
              >
                <ScrollView showsVerticalScrollIndicator={true}>
                  <View style={themed(styles.$filterModalContainer)}>
                    <View style={themed(styles.$filterModalHeader)}>
                      <Text style={themed(styles.$filterModalTitle)}>Filter Inventory</Text>
                      <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                        <FontAwesome name="times" size={24} color={theme.colors.text} />
                      </TouchableOpacity>
                    </View>

                    <View style={themed(styles.$filterSection)}>
                      <Text style={themed(styles.$filterSectionTitle)}>Sort By</Text>
                      <View style={themed(styles.$filterOptions)}>
                        <TouchableOpacity
                          style={[
                            themed(styles.$filterOption),
                            tempSortBy === "lastUpdated" && themed(styles.$filterOptionSelected),
                          ]}
                          onPress={() => setTempSortBy("lastUpdated")}
                        >
                          <Text
                            style={[
                              themed(styles.$filterOptionText),
                              tempSortBy === "lastUpdated" &&
                                themed(styles.$filterOptionTextSelected),
                            ]}
                          >
                            Last Updated
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            themed(styles.$filterOption),
                            tempSortBy === "expiryDate" && themed(styles.$filterOptionSelected),
                          ]}
                          onPress={() => setTempSortBy("expiryDate")}
                        >
                          <Text
                            style={[
                              themed(styles.$filterOptionText),
                              tempSortBy === "expiryDate" &&
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
                </ScrollView>
              </KeyboardAvoidingView>
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
              placeholder="Search product name, location..."
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

        {(sortBy !== "lastUpdated" || sortOrder !== "asc") && (
          <View style={themed(styles.$filterIndicators)}>
            {(sortBy !== "lastUpdated" || sortOrder !== "asc") && (
              <View style={themed(styles.$filterTag)}>
                <Text style={themed(styles.$filterTagText)}>
                  Sort:{" "}
                  {sortBy === "lastUpdated"
                    ? "Last Updated"
                    : sortBy === "expiryDate"
                      ? "Expiry Date"
                      : sortBy}{" "}
                  ({sortOrder === "asc" ? "↑" : "↓"})
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSortBy("lastUpdated")
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
            keyExtractor={(item) => item.id}
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
