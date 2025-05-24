/* eslint-disable prettier/prettier */
import { Stack } from "expo-router"

export default function SettingsLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  )
}
