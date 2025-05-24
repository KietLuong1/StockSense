/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { FontAwesome } from "@expo/vector-icons"
import { useAuth } from "context/AuthContext"
import { Alert, TouchableOpacity, View } from "react-native"
import styles from "./styles"

export default function Settings() {
  const { logout } = useAuth()
  const { themed } = useAppTheme()

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout()
          } catch (error) {
            console.error("Error during logout:", error)
            Alert.alert("Logout Error", "An error occurred during logout. Please try again.")
          }
        },
      },
    ])
  }
  return (
    <Screen preset="scroll" safeAreaEdges={["top"]}>
      <View style={themed(styles.$headerContainer)}>
        <Text preset="heading" text="Settings" style={themed(styles.$headerText)} />
      </View>
      <View style={themed(styles.$container)}>
        
        <TouchableOpacity style={themed(styles.$settingItem)}>
          <View style={themed(styles.$settingRow)}>
            <FontAwesome name="user" size={20} color={useAppTheme().theme.colors.text} />
            <Text text="Profile" style={themed(styles.$settingText)} />
          </View>
          <FontAwesome name="chevron-right" size={16} color={useAppTheme().theme.colors.textDim} />
        </TouchableOpacity>
        
        <TouchableOpacity style={themed(styles.$settingItem)}>
          <View style={themed(styles.$settingRow)}>
            <FontAwesome name="bell" size={20} color={useAppTheme().theme.colors.text} />
            <Text text="Notifications" style={themed(styles.$settingText)} />
          </View>
          <FontAwesome name="chevron-right" size={16} color={useAppTheme().theme.colors.textDim} />
        </TouchableOpacity>
        
        <TouchableOpacity style={themed(styles.$settingItem)}>
          <View style={themed(styles.$settingRow)}>
            <FontAwesome name="lock" size={20} color={useAppTheme().theme.colors.text} />
            <Text text="Security" style={themed(styles.$settingText)} />
          </View>
          <FontAwesome name="chevron-right" size={16} color={useAppTheme().theme.colors.textDim} />
        </TouchableOpacity>
        
        <Text preset="subheading" text="More" style={[themed(styles.$contentHeader), {marginTop: 20}]} />
        
        <TouchableOpacity style={themed(styles.$settingItem)}>
          <View style={themed(styles.$settingRow)}>
            <FontAwesome name="question-circle" size={20} color={useAppTheme().theme.colors.text} />
            <Text text="Help & Support" style={themed(styles.$settingText)} />
          </View>
          <FontAwesome name="chevron-right" size={16} color={useAppTheme().theme.colors.textDim} />
        </TouchableOpacity>
        
        <TouchableOpacity style={themed(styles.$settingItem)}>
          <View style={themed(styles.$settingRow)}>
            <FontAwesome name="info-circle" size={20} color={useAppTheme().theme.colors.text} />
            <Text text="About" style={themed(styles.$settingText)} />
          </View>
          <FontAwesome name="chevron-right" size={16} color={useAppTheme().theme.colors.textDim} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={themed(styles.$logoutTouchable)}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <View style={themed(styles.$logoutRow)}>
            <FontAwesome
              name="sign-out"
              size={24}
              color={useAppTheme().theme.colors.error}
            />
            <Text preset="bold" text="Logout" style={themed(styles.$logoutTextStyle)} />
          </View>
        </TouchableOpacity>
      </View>
    </Screen>
  )
}
