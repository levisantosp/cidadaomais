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

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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