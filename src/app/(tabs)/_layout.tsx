/* eslint-disable prettier/prettier */
import { Redirect, Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useAppTheme } from "@/utils/useAppTheme";
import { useAuth } from "context/AuthContext";

export default function TabsLayout() {
  const {theme} = useAppTheme();
  const {isAuthenticated} = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect href="/screens/Signin" />;
  }
  

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.palette.primary500,
        tabBarInactiveTintColor: theme.colors.palette.neutral500,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.palette.neutral200,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
        <Tabs.Screen
        name="Inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list-ul" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Transaction"
        options={{
          title: "Transaction",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="file-text" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="gear" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}