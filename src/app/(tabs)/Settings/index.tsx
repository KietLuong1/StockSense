/* eslint-disable prettier/prettier */
import { Button, Screen, Text } from '@/components'
import { useAppTheme } from '@/utils/useAppTheme'
import { FontAwesome } from "@expo/vector-icons"
import { useAuth } from 'context/AuthContext'
import { Alert, View } from 'react-native'
import { $container, $contentText, $headerContainer, $headerText, $logoutButton } from './styles'

export default function Settings() {
    const { logout } = useAuth()
    const { themed } = useAppTheme()
    
    const handleLogout = () => {
      Alert.alert(
        "Confirm Logout",
        "Are you sure you want to log out?",
        [
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
            }
          }
        ]
      )
    }
    
    return (
      <Screen preset="scroll" safeAreaEdges={["top"]}>
        <View style={themed($headerContainer)}>
          <Text preset="heading" text="Settings" style={themed($headerText)} />
          <Button
            preset="default"
            LeftAccessory={() => <FontAwesome name="sign-out" size={20} color="white" />}
            style={themed($logoutButton)}
            onPress={handleLogout}
          />
        </View>
        
        <View style={themed($container)}>
          <Text preset="subheading" text="Your settings content here" style={themed($contentText)} />
        </View>
      </Screen>
    )
}


