import '../global.css'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePathname } from 'expo-router'
import React from 'react'
import { useColorScheme } from 'react-native'
import AppTabs from '@/components/app-tabs'

const queryClient = new QueryClient()

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppTabs />
        <PortalHost />
      </ThemeProvider>
    </QueryClientProvider>
  )
}