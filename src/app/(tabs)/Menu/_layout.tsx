/* eslint-disable prettier/prettier */
import { Stack } from "expo-router"

export default function MenuLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Product/index" options={{ title: "Product" }} />
      <Stack.Screen name="Suppliers/index" options={{ title: "Suppliers" }} />
      <Stack.Screen name="Location/index" options={{ title: "Location" }} />
    </Stack>
  )
}
