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
import { ProductResponse } from "@/queries/Products/types"
import styles from "./styles"
import { useGetListProduct } from "@/queries/Products/useGetListProducts"

export default function Product() {
  const { themed, theme } = useAppTheme()
  const insets = useSafeAreaInsets()

  const [products, setProducts] = useState<ProductResponse[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductResponse[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState("All")
  const [categories, setCategories] = useState<string[]>(["All"])

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sortBy, setSortBy] = useState<"name" | "price" | "category">("name")
  const [filterModalVisible, setFilterModalVisible] = useState(false)

  const [tempCategory, setTempCategory] = useState("All")
  const [tempSortBy, setTempSortBy] = useState<"name" | "price" | "category">("name")
  const [tempSortOrder, setTempSortOrder] = useState<"asc" | "desc">("asc")

  const { data: productsData, error: productsError } = useGetListProduct()

  const openFilterModal = () => {
    setTempCategory(selectedCategory)
    setTempSortBy(sortBy)
    setTempSortOrder(sortOrder)
    setFilterModalVisible(true)
  }

  const applyFilters = () => {
    setSelectedCategory(tempCategory)
    setSortBy(tempSortBy)
    setSortOrder(tempSortOrder)
    setFilterModalVisible(false)
  }

  const resetFilters = () => {
    setTempCategory("All")
    setTempSortBy("name")
    setTempSortOrder("asc")
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        if (productsError) {
          throw productsError
        }
        if (productsData) {
          setProducts(productsData)
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(productsData.map((item) => item.categoryId)))
          setCategories(["All", ...uniqueCategories])
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        Alert.alert("Error", "Failed to load products data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [productsData, productsError])

  useEffect(() => {
    let filtered = [...products]

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.categoryId === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) => {
        const productName = item.name.toLowerCase()
        const productId = (item.id ?? "").toLowerCase()
        return productName.includes(query) || productId.includes(query)
      })
    }

    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortBy === "category") {
        return sortOrder === "asc"
          ? a.categoryId.localeCompare(b.categoryId)
          : b.categoryId.localeCompare(a.categoryId)
      } else {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, sortOrder, sortBy])

  const onRefresh = async () => {
    setRefreshing(true)
    setIsLoading(true)
    try {
      if (productsData) {
        setProducts(productsData)
      }
    } catch (error) {
      console.error("Error refreshing products:", error)
      Alert.alert("Error", "Failed to refresh products data")
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const renderItem = ({ item }: { item: ProductResponse }) => {
    return (
      <TouchableOpacity
        style={themed(styles.$itemContainer)}
        onPress={() =>
          Alert.alert(
            item.name,
            `Sku: ${item.sku}
            \nPrice: ${formatPrice(item.price)}
            \nStock Quantity: ${item.stockQuantity}
            \nCreated At: ${formatDate(item.createdAt ?? "")}
            \nExpiry Date: ${formatDate(item.expiryDate ?? "")}
            \nDescription: ${item.description}
            `,
          )
        }
      >
        <View style={themed(styles.$itemContent)}>
          <View style={themed(styles.$itemHeader)}>
            <Text style={themed(styles.$itemName)}>{item.name}</Text>
            <Text style={themed(styles.$itemPrice)}>{formatPrice(item.price)}</Text>
          </View>

          <View style={themed(styles.$itemDetails)}>
            <Text style={themed(styles.$itemId)}>SKU: {item.sku}</Text>
            <Text style={themed(styles.$itemStockQuantity)}>Quantity: {item.stockQuantity}</Text>
          </View>

          <View style={themed(styles.$itemFooter)}>
            <Text style={themed(styles.$itemDate)}>Created: {formatDate(item.createdAt)}</Text>
            <Text style={themed(styles.$itemDate)}>Expiry: {formatDate(item.expiryDate)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  const renderEmptyList = () => {
    if (isLoading) return null

    return (
      <View style={themed(styles.$emptyContainer)}>
        <FontAwesome name="shopping-basket" size={50} color={theme.colors.palette.neutral400} />
        <Text style={themed(styles.$emptyText)}>
          {searchQuery || selectedCategory !== "All"
            ? "No matching products found"
            : "No products available"}
        </Text>
        <Text style={themed(styles.$emptyText)}>Pull down to refresh the list</Text>
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
                      <Text style={themed(styles.$filterModalTitle)}>Filter Products</Text>
                      <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                        <FontAwesome name="times" size={24} color={theme.colors.text} />
                      </TouchableOpacity>
                    </View>

                    {/* <View style={themed(styles.$filterSection)}>
                      <Text style={themed(styles.$filterSectionTitle)}>Category</Text>
                      <View style={themed(styles.$filterOptions)}>
                        {categories.map((category) => (
                          <TouchableOpacity
                            key={category}
                            style={[
                              themed(styles.$filterOption),
                              tempCategory === category && themed(styles.$filterOptionSelected),
                            ]}
                            onPress={() => setTempCategory(category)}
                          >
                            <Text
                              style={[
                                themed(styles.$filterOptionText),
                                tempCategory === category &&
                                  themed(styles.$filterOptionTextSelected),
                              ]}
                            >
                              {category}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View> */}

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
                            tempSortBy === "price" && themed(styles.$filterOptionSelected),
                          ]}
                          onPress={() => setTempSortBy("price")}
                        >
                          <Text
                            style={[
                              themed(styles.$filterOptionText),
                              tempSortBy === "price" && themed(styles.$filterOptionTextSelected),
                            ]}
                          >
                            Price
                          </Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity
                          style={[
                            themed(styles.$filterOption),
                            tempSortBy === "category" && themed(styles.$filterOptionSelected),
                          ]}
                          onPress={() => setTempSortBy("category")}
                        >
                          <Text
                            style={[
                              themed(styles.$filterOptionText),
                              tempSortBy === "category" && themed(styles.$filterOptionTextSelected),
                            ]}
                          >
                            Category
                          </Text>
                        </TouchableOpacity> */}
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
            Products
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
              placeholder="Search products..."
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
        {(selectedCategory !== "All" || sortBy !== "name" || sortOrder !== "asc") && (
          <View style={themed(styles.$filterIndicators)}>
            {selectedCategory !== "All" && (
              <View style={themed(styles.$filterTag)}>
                <Text style={themed(styles.$filterTagText)}>Category: {selectedCategory}</Text>
                <TouchableOpacity
                  onPress={() => setSelectedCategory("All")}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <FontAwesome name="times" size={12} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
            )}

            {(sortBy !== "name" || sortOrder !== "asc") && (
              <View style={themed(styles.$filterTag)}>
                <Text style={themed(styles.$filterTagText)}>
                  Sort: {sortBy === "name" ? "Name" : sortBy === "price" ? "Price" : "Category"} (
                  {sortOrder === "asc" ? "↑" : "↓"})
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
            data={filteredProducts}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id ?? index.toString()}
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
