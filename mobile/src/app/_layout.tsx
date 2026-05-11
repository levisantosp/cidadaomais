import '../global.css'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useColorScheme, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Toaster } from 'sonner-native'
import AppTabs from '@/components/app-tabs'

const queryClient = new QueryClient()
const APP_BACKGROUND = '#012034'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme
  const navigationTheme = {
    ...baseTheme,
    dark: true,
    colors: {
      ...baseTheme.colors,
      primary: '#044892',
      background: APP_BACKGROUND,
      card: '#072940',
      text: '#f3f8fc',
      border: 'rgba(255, 255, 255, 0.12)',
      notification: '#3f9731'
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: APP_BACKGROUND }}>
        <ThemeProvider value={navigationTheme}>
          <AppTabs />
          <PortalHost />
          <Toaster
            ToasterOverlayWrapper={({ children }) => (
              <View
                pointerEvents='box-none'
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 9999,
                  elevation: 9999
                }}
              >
                {children}
              </View>
            )}
          />
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}