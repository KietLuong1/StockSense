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
import { LocationResponse } from "@/queries/Location/types"
import { useGetListLocation } from "@/queries/Location/useGetListLocation"
import styles from "./styles"

export default function Location() {
  const { themed, theme } = useAppTheme()
  const insets = useSafeAreaInsets()

  const [locations, setLocations] = useState<LocationResponse[]>([])
  const [filteredLocations, setFilteredLocations] = useState<LocationResponse[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const { data: locationsData, error: locationsError } = useGetListLocation()

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true)
      try {
        if (locationsError) {
          throw locationsError
        }
        
        if (locationsData) {
          setLocations(locationsData)
        }
      } catch (error) {
        console.error("Error fetching locations:", error)
        Alert.alert("Error", "Failed to load location data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [locationsData, locationsError])

  useEffect(() => {
    let filtered = [...locations]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) => {
        const zoneText = item.zone.toLowerCase()
        const shelfText = item.shelf.toLowerCase()
        const rackText = item.rack.toLowerCase()
        const descriptionText = item.description.toLowerCase()
        const codeText = item.code.toString().toLowerCase()
        
        return (
          zoneText.includes(query) ||
          shelfText.includes(query) ||
          rackText.includes(query) ||
          descriptionText.includes(query) ||
          codeText.includes(query)
        )
      })
    }

    setFilteredLocations(filtered)
  }, [locations, searchQuery])

  const onRefresh = async () => {
    setRefreshing(true)

    try {
      if (locationsData) {
        setLocations(locationsData)
      }
    } catch (error) {
      console.error("Error refreshing locations:", error)
      Alert.alert("Error", "Failed to refresh location data")
    } finally {
      setRefreshing(false)
    }
  }
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active':
        return theme.colors.palette.angry500
      case 'Inactive':
        return theme.colors.palette.neutral900
      case 'Closed':
        return theme.colors.errorBackground
      case 'In progress':
        return theme.colors.palette.secondary500
      default:
        return theme.colors.palette.primary500
    }
  }

  const renderItem = ({ item }: { item: LocationResponse }) => {
    return (
      <TouchableOpacity
        style={themed(styles.$itemContainer)}
        onPress={() =>
          Alert.alert(
            `Location ${item.code}`,
            `Zone: ${item.zone}\nShelf: ${item.shelf}\nRack: ${item.rack}\nCapacity: ${item.capacity}\nStatus: ${item.status}\nDescription: ${item.description}`
          )
        }
      >
        <View style={themed(styles.$itemContent)}>
          <View style={themed(styles.$itemHeader)}>
            <Text style={themed(styles.$itemCode)}>Code: {item.code}</Text>
            <View style={[themed(styles.$statusBadge), { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={themed(styles.$statusText)}>{item.status}</Text>
            </View>
          </View>

          <View style={themed(styles.$itemDetails)}>
            <Text style={themed(styles.$itemLocation)}>
              Zone: {item.zone} | Shelf: {item.shelf} | Rack: {item.rack}
            </Text>
            <Text style={themed(styles.$itemCapacity)}>Capacity: {item.capacity}</Text>
            <Text style={themed(styles.$itemDescription)} numberOfLines={1}>
              {item.description}
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

  return (
    <KeyboardAvoidingView
      style={styles.$root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.bottom : 0}
    >
      <Screen preset="fixed" safeAreaEdges={["top"]} style={styles.$screen}>
        <View style={themed(styles.$headerContainer)}>
          <Text preset="heading" style={themed(styles.$headerText)}>
            Location
          </Text>
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

        {isLoading ? (
          <View style={themed(styles.$loadingContainer)}>
            <ActivityIndicator size="large" color={theme.colors.palette.primary500} />
            <Text style={themed(styles.$loadingText)}>Loading locations...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredLocations}
            renderItem={renderItem}
            keyExtractor={(item) => item.location_id}
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