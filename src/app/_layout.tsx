/* eslint-disable prettier/prettier */
import { initI18n } from "@/i18n"
import { useInitialRootStore } from "@/models"
import { customFontsToLoad } from "@/theme"
import { loadDateFnsLocale } from "@/utils/formatDate"
import { useThemeProvider } from "@/utils/useAppTheme"
import { useFonts } from "@expo-google-fonts/space-grotesk"
import { AuthProvider, useAuth } from "context/AuthContext"
import { SplashScreen, Stack } from "expo-router"
import { useEffect, useState } from "react"

SplashScreen.preventAutoHideAsync()

if (__DEV__) {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
  require("src/devtools/ReactotronConfig.ts")
}

export { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary"

function Navigation() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  return (
    <Stack initialRouteName="index" 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right' 
      }} 
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="screens" options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="screens" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}

export default function Root() {
  const { rehydrated } = useInitialRootStore()

  const [fontsLoaded, fontError] = useFonts(customFontsToLoad)
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)
  const { themeScheme, setThemeContextOverride, ThemeProvider } = useThemeProvider()

  useEffect(() => {
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale())
  }, [])

  const loaded = fontsLoaded && isI18nInitialized && rehydrated

  useEffect(() => {
    if (fontError) throw fontError
  }, [fontError])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <AuthProvider >
      <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
        <Navigation/>
      </ThemeProvider>
    </AuthProvider>
  )
}


