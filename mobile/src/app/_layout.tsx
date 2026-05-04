import '../global.css'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useColorScheme } from 'react-native'
import { AnimatedSplashOverlay } from '@/components/animated-icon'
import { AppHeader } from '@/components/app-header'
import AppTabs from '@/components/app-tabs'

const queryClient = new QueryClient()

export default function TabLayout() {
  const colorScheme = useColorScheme()
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <AppHeader />
        <AppTabs />
        <PortalHost />
      </ThemeProvider>
    </QueryClientProvider>
  )
}