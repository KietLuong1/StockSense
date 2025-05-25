/* eslint-disable prettier/prettier */
import { Stack } from "expo-router"

export default function MenuLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Product" options={{ title: "Product" }} />
    </Stack>
  )
}
