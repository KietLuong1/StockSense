/* eslint-disable prettier/prettier */
import { Stack } from "expo-router"

export default function TransactionLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  )
}
