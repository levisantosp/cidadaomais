import { Tabs } from 'expo-router'
import { Home, Info, Layers, Search } from 'lucide-react-native'
import React from 'react'
import { useColorScheme } from 'react-native'
import { Colors } from '@/constants/theme'

const BRAND_BLUE = '#0186ca'

export default function AppTabs() {
  const scheme = useColorScheme()
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light']

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BRAND_BLUE,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.background
        }
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />

      <Tabs.Screen
        name='categories'
        options={{
          title: 'Categorias',
          tabBarIcon: ({ color, size }) => <Layers color={color} size={size} />
        }}
      />

      <Tabs.Screen
        name='search'
        options={{
          title: 'Busca',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />
        }}
      />

      <Tabs.Screen
        name='about'
        options={{
          title: 'Sobre',
          tabBarIcon: ({ color, size }) => <Info color={color} size={size} />
        }}
      />
    </Tabs>
  )
}