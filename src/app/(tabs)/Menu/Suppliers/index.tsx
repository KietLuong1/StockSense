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
import { SupplierResponse } from "@/queries/Supplier/types"
import { useGetListSupplier } from "@/queries/Supplier/useGetListSuppliers"
import styles from "./styles"

export default function Suppliers() {
  const { themed, theme } = useAppTheme()
  const insets = useSafeAreaInsets()

  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<SupplierResponse[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sortBy, setSortBy] = useState<"name" | "address" | "contactInfo">("name")
  const [filterModalVisible, setFilterModalVisible] = useState(false)

  const [tempSortBy, setTempSortBy] = useState<"name" | "address" | "contactInfo">("name")
  const [tempSortOrder, setTempSortOrder] = useState<"asc" | "desc">("asc")

  const { data: suppliersData, error: suppliersError } = useGetListSupplier()

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
    setTempSortBy("name")
    setTempSortOrder("asc")
  }

  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true)
      try {
        if (suppliersError) {
          throw suppliersError
        }

        if (suppliersData) {
          setSuppliers(suppliersData)
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error)
        Alert.alert("Error", "Failed to load suppliers data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuppliers()
  }, [suppliersData, suppliersError])

  useEffect(() => {
    let filtered = [...suppliers]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) => {
        const supplierName = item.name.toLowerCase()
        const supplierContactInfo = item.contactInfo.toLowerCase()
        const supplierAddress = item.address.toLowerCase()
        return (
          supplierName.includes(query) ||
          supplierContactInfo.includes(query) ||
          supplierAddress.includes(query)
        )
      })
    }

    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortBy === "address") {
        return sortOrder === "asc"
          ? a.address.localeCompare(b.address)
          : b.address.localeCompare(a.address)
      } else if (sortBy === "contactInfo") {
        return sortOrder === "asc"
          ? a.contactInfo.localeCompare(b.contactInfo)
          : b.contactInfo.localeCompare(a.contactInfo)
      } else {
        return 0
      }
    })

    setFilteredSuppliers(filtered)
  }, [suppliers, searchQuery, sortOrder, sortBy])

  const onRefresh = async () => {
    setRefreshing(true)
    setIsLoading(true)
    try {
      if (suppliersData) {
        setSuppliers(suppliersData)
      }
    } catch (error) {
      console.error("Error refreshing suppliers:", error)
      Alert.alert("Error", "Failed to refresh suppliers data")
    } finally {
      setTimeout(() => {
        setRefreshing(false)
        setIsLoading(false)
      }, 800)
    }
  }

  const renderItem = ({ item }: { item: SupplierResponse }) => {
    return (
      <TouchableOpacity
        style={themed(styles.$itemContainer)}
        onPress={() =>
          Alert.alert(
            item.name,
            `Name: ${item.name}
            \nContact Info: ${item.contactInfo}
            \nAddress: ${item.address}`,
          )
        }
      >
        <View style={themed(styles.$itemContent)}>
          <View style={themed(styles.$itemHeader)}>
            <Text style={themed(styles.$itemName)}>{item.name}</Text>
          </View>

          <View style={themed(styles.$itemDetails)}>
            <Text style={themed(styles.$itemAddress)}>Address: {item.address}</Text>
          </View>

          <View style={themed(styles.$itemDetails)}>
            <Text style={themed(styles.$itemContactInfo)}>
              Contact Information: {item.contactInfo}
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
        <FontAwesome name="users" size={50} color={theme.colors.palette.neutral400} />
        <Text style={themed(styles.$emptyText)}>
          {searchQuery ? "No matching suppliers found" : "No suppliers available"}
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
                <View style={themed(styles.$filterModalContainer)}>
                  <View style={themed(styles.$filterModalHeader)}>
                    <Text style={themed(styles.$filterModalTitle)}>Filter Products</Text>
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
                          tempSortBy === "name" && themed(styles.$filterOptionSelected),
                        ]}
                        onPress={() => setTempSortBy("name")}
                      >
                        <Text
                          style={[
                            themed(styles.$filterOptionText),
                            tempSortBy === "name" && themed(styles.$filterOptionTextSelected),
                          ]}
                        >
                          Name
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          themed(styles.$filterOption),
                          tempSortBy === "address" && themed(styles.$filterOptionSelected),
                        ]}
                        onPress={() => setTempSortBy("address")}
                      >
                        <Text
                          style={[
                            themed(styles.$filterOptionText),
                            tempSortBy === "address" && themed(styles.$filterOptionTextSelected),
                          ]}
                        >
                          Address
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          themed(styles.$filterOption),
                          tempSortBy === "contactInfo" && themed(styles.$filterOptionSelected),
                        ]}
                        onPress={() => setTempSortBy("contactInfo")}
                      >
                        <Text
                          style={[
                            themed(styles.$filterOptionText),
                            tempSortBy === "contactInfo" &&
                              themed(styles.$filterOptionTextSelected),
                          ]}
                        >
                          Contact Infomation
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
            Suppliers
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
              placeholder="Search suppliers..."
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
        {(sortBy !== "name" || sortOrder !== "asc") && (
          <View style={themed(styles.$filterIndicators)}>
            {(sortBy !== "name" || sortOrder !== "asc") && (
              <View style={themed(styles.$filterTag)}>
                <Text style={themed(styles.$filterTagText)}>
                  Sort:{" "}
                  {sortBy === "name"
                    ? "Name"
                    : sortBy === "address"
                      ? "Address"
                      : "Contact Information"}
                  ({sortOrder === "asc" ? "↑" : "↓"})
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSortBy("name")
                    setSortOrder("asc")
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <FontAwesome name="times" size={12} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}{" "}
        {isLoading ? (
          <View style={themed(styles.$loadingContainer)}>
            <ActivityIndicator size="large" color={theme.colors.palette.primary500} />
            <Text style={themed(styles.$loadingText)}>
              {refreshing ? "Refreshing products..." : "Loading products..."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredSuppliers}
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
