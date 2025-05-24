/* eslint-disable prettier/prettier */
import { Stack } from "expo-router"

export default function InventoryLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  )
}
