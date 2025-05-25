/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { FontAwesome } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TextInput,
  TouchableOpacity,
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

  const { data: suppliersData, error: suppliersError } = useGetListSupplier()

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
        Alert.alert("Error", "Failed to load supplier data")
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
        const supplierEmail = item.email.toLowerCase()
        const supplierAddress = item.address.toLowerCase()
        return (
          supplierName.includes(query) ||
          supplierEmail.includes(query) ||
          supplierAddress.includes(query)
        )
      })
    }

    setFilteredSuppliers(filtered)
  }, [suppliers, searchQuery])

  const onRefresh = async () => {
    setRefreshing(true)

    try {
      if (suppliersData) {
        setSuppliers(suppliersData)
      }
    } catch (error) {
      console.error("Error refreshing suppliers:", error)
      Alert.alert("Error", "Failed to refresh supplier data")
    } finally {
      setRefreshing(false)
    }
  }

  const formatPhone = (phone: number) => {
    const phoneString = phone.toString()
    // Format phone number as (XXX) XXX-XXXX if it's 10 digits
    if (phoneString.length === 10) {
      return `(${phoneString.substring(0, 3)}) ${phoneString.substring(3, 6)}-${phoneString.substring(6)}`
    }
    return phoneString
  }

  const renderItem = ({ item }: { item: SupplierResponse }) => {
    return (
      <TouchableOpacity
        style={themed(styles.$itemContainer)}
        onPress={() =>
          Alert.alert(
            item.name,
            `Email: ${item.email}\nPhone: ${formatPhone(item.phone)}\nAddress: ${item.address}\nCreated: ${new Date(item.create_at).toLocaleDateString()}`
          )
        }
      >
        <View style={themed(styles.$itemContent)}>
          <View style={themed(styles.$itemHeader)}>
            <Text style={themed(styles.$itemName)}>{item.name}</Text>
            <Text style={themed(styles.$itemEmail)}>{item.email}</Text>
          </View>

          <View style={themed(styles.$itemDetails)}>
            <Text style={themed(styles.$itemPhone)}>{formatPhone(item.phone)}</Text>
            <Text style={themed(styles.$itemAddress)} numberOfLines={1}>
              {item.address}
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

        {isLoading ? (
          <View style={themed(styles.$loadingContainer)}>
            <ActivityIndicator size="large" color={theme.colors.palette.primary500} />
            <Text style={themed(styles.$loadingText)}>Loading suppliers...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredSuppliers}
            renderItem={renderItem}
            keyExtractor={(item) => item.supplierId}
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
      </Screen>
    </KeyboardAvoidingView>
  )
}