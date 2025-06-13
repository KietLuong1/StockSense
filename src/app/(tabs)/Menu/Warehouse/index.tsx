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
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { WarehouseResponse } from "@/queries/Warehouse/types"
import { useGetListWarehouse } from "@/queries/Warehouse/useGetListWarehouse"
import styles from "./styles"
import { WarehouseKey } from "@/queries/Warehouse/key"

export default function Warehouse() {
  const { themed, theme } = useAppTheme()
  const insets = useSafeAreaInsets()

  const [warehouses, setWarehouses] = useState<WarehouseResponse[]>([])
  const [filteredWarehouses, setFilteredWarehouses] = useState<WarehouseResponse[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [selectedActive, setSelectedActive] = useState("All")
  const [active, setActive] = useState<string[]>(["All"])

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sortBy, setSortBy] = useState<WarehouseKey>(WarehouseKey.ID)
  const [filterModalVisible, setFilterModalVisible] = useState(false)

  const [tempActive, setTempActive] = useState("All")
  const [tempSortBy, setTempSortBy] = useState<WarehouseKey>(WarehouseKey.ID)
  const [tempSortOrder, setTempSortOrder] = useState<"asc" | "desc">("asc")

  const { data: warehousesData, error: warehousesError } = useGetListWarehouse()

  const openFilterModal = () => {
    setTempActive(selectedActive)
    setTempSortBy(sortBy)
    setTempSortOrder(sortOrder)
    setFilterModalVisible(true)
  }

  const applyFilters = () => {
    setSelectedActive(tempActive)
    setSortBy(tempSortBy)
    setSortOrder(tempSortOrder)
    setFilterModalVisible(false)
  }

  const resetFilters = () => {
    setTempActive("All")
    setTempSortBy(WarehouseKey.ID)
    setTempSortOrder("asc")
  }

  useEffect(() => {
    const fetchWarehouses = async () => {
      setIsLoading(true)
      try {
        if (warehousesError) {
          throw warehousesError
        }

        if (warehousesData) {
          setWarehouses(warehousesData)

          // Extract unique active statuses
          const uniqueActiveStatuses = Array.from(
            new Set(
              warehousesData.map((item) => (Number(item.active) === 1 ? "Active" : "Inactive")),
            ),
          )
          setActive(["All", ...uniqueActiveStatuses])
        }
      } catch (error) {
        console.error("Error fetching warehouses:", error)
        Alert.alert("Error", "Failed to load warehouse data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWarehouses()
  }, [warehousesData, warehousesError])

  useEffect(() => {
    let filtered = [...warehouses]

    if (selectedActive !== "All") {
      filtered = filtered.filter(
        (item) => (Number(item.active) === 1 ? "Active" : "Inactive") === selectedActive,
      )
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) => {
        const location = item.location.toLowerCase()
        const name = item.name.toLowerCase()

        return location.includes(query) || name.includes(query)
      })
    }

    const keyMap: Record<WarehouseKey, keyof WarehouseResponse> = {
      [WarehouseKey.ID]: "id",
      [WarehouseKey.NAME]: "name",
      [WarehouseKey.LOCATION]: "location",
      [WarehouseKey.CAPACITY]: "capacity",
      [WarehouseKey.ACTIVE]: "active",
      [WarehouseKey.CREATED_AT]: "createdAt",
      [WarehouseKey.UPDATED_AT]: "updatedAt",
    }

    filtered.sort((a, b) => {
      const mappedKey = keyMap[sortBy]
      let valueA: any = a[mappedKey]
      let valueB: any = b[mappedKey]

      if (mappedKey === "createdAt" || mappedKey === "updatedAt") {
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

    setFilteredWarehouses(filtered)
  }, [warehouses, searchQuery, selectedActive, sortOrder, sortBy])

  const onRefresh = async () => {
    setRefreshing(true)
    setIsLoading(true)

    try {
      if (warehousesData) {
        setWarehouses(warehousesData)
      }
    } catch (error) {
      console.error("Error refreshing warehouses:", error)
      Alert.alert("Error", "Failed to refresh warehouse data")
    } finally {
      setTimeout(() => {
        setRefreshing(false)
        setIsLoading(false)
      }, 800)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "1":
        return theme.colors.palette.angry500
      case "0":
        return theme.colors.palette.neutral900
      default:
        return theme.colors.palette.primary500
    }
  }

  const formatCapacity = (capacity: number) => {
    return `${capacity.toLocaleString("vi-VN")} m²`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const renderItem = ({ item }: { item: WarehouseResponse }) => {
    return (
      <TouchableOpacity
        style={themed(styles.$itemContainer)}
        onPress={() =>
          Alert.alert(
            item.name,
            `Location: ${item.location}
            \nCapacity: ${formatCapacity(item.capacity)}
            \nActive: ${item.active ? "Active" : "Inactive"}
            \nCreated At: ${formatDate(item.createdAt ?? "")}
            \nUpdated Date: ${formatDate(item.updatedAt ?? "")}`,
          )
        }
      >
        <View style={themed(styles.$itemContent)}>
          <View style={themed(styles.$itemHeader)}>
            <Text style={themed(styles.$itemCode)}>{item.name}</Text>
            <View
              style={[
                themed(styles.$statusBadge),
                { backgroundColor: getStatusColor(item.active ? "1" : "0") },
              ]}
            >
              <Text style={themed(styles.$statusText)}>{item.active ? "Active" : "Inactive"}</Text>
            </View>
          </View>

          <View style={themed(styles.$itemDetails)}>
            <Text style={themed(styles.$itemLocation)}>Location: {item.location}</Text>
            <Text style={themed(styles.$itemCapacity)}>
              Capacity: {formatCapacity(item.capacity)}
            </Text>
          </View>

          <View style={themed(styles.$itemFooter)}>
            <Text style={themed(styles.$itemDate)}>Created: {formatDate(item.createdAt)}</Text>
            <Text style={themed(styles.$itemDate)}>Updated: {formatDate(item.updatedAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderEmptyList = () => {
    if (isLoading) return null

    return (
      <View style={themed(styles.$emptyContainer)}>
        <FontAwesome name="map-marker" size={50} color={theme.colors.palette.neutral400} />
        <Text style={themed(styles.$emptyText)}>
          {searchQuery ? "No matching locations found" : "No locations available"}
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
            <TouchableWithoutFeedback>
              <View style={themed(styles.$filterModalContainer)}>
                <View style={themed(styles.$filterModalHeader)}>
                  <Text style={themed(styles.$filterModalTitle)}>Filter Transactions</Text>
                  <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                    <FontAwesome name="times" size={24} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>

                <View style={themed(styles.$filterSection)}>
                  <Text style={themed(styles.$filterSectionTitle)}>Type</Text>
                  <View style={themed(styles.$filterOptions)}>
                    {active.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          themed(styles.$filterOption),
                          tempActive === type && themed(styles.$filterOptionSelected),
                        ]}
                        onPress={() => setTempActive(type)}
                      >
                        <Text
                          style={[
                            themed(styles.$filterOptionText),
                            tempActive === type && themed(styles.$filterOptionTextSelected),
                          ]}
                        >
                          {type}
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
                        tempSortBy === WarehouseKey.CREATED_AT &&
                          themed(styles.$filterOptionSelected),
                      ]}
                      onPress={() => setTempSortBy(WarehouseKey.CREATED_AT)}
                    >
                      <Text
                        style={[
                          themed(styles.$filterOptionText),
                          tempSortBy === WarehouseKey.CREATED_AT &&
                            themed(styles.$filterOptionTextSelected),
                        ]}
                      >
                        Created At
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        themed(styles.$filterOption),
                        tempSortBy === WarehouseKey.UPDATED_AT &&
                          themed(styles.$filterOptionSelected),
                      ]}
                      onPress={() => setTempSortBy(WarehouseKey.UPDATED_AT)}
                    >
                      <Text
                        style={[
                          themed(styles.$filterOptionText),
                          tempSortBy === WarehouseKey.UPDATED_AT &&
                            themed(styles.$filterOptionTextSelected),
                        ]}
                      >
                        Updated At
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
            Warehouse
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
              placeholder="Search locations..."
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
        {(selectedActive !== "All" ||
          sortBy !== WarehouseKey.UPDATED_AT ||
          sortOrder !== "asc") && (
          <View style={themed(styles.$filterIndicators)}>
            {selectedActive !== "All" && (
              <View style={themed(styles.$filterTag)}>
                <Text style={themed(styles.$filterTagText)}>Type: {selectedActive}</Text>
                <TouchableOpacity
                  onPress={() => setSelectedActive("All")}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <FontAwesome name="times" size={12} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
            )}

            {(sortBy !== WarehouseKey.ID || sortOrder !== "asc") && (
              <View style={themed(styles.$filterTag)}>
                <Text style={themed(styles.$filterTagText)}>
                  Sort:
                  {sortBy === WarehouseKey.ID
                    ? "Warehouse ID"
                    : sortBy === WarehouseKey.CREATED_AT
                      ? "Created At"
                      : sortBy === WarehouseKey.UPDATED_AT
                        ? "Updated At"
                        : ""}
                  ({sortOrder === "asc" ? "↑" : "↓"})
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSortBy(WarehouseKey.ID)
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
            <Text style={themed(styles.$loadingText)}>
              {refreshing ? "Refreshing warehouses..." : "Loading warehouses..."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredWarehouses}
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
