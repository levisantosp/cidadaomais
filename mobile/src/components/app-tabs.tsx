import { usePathname } from 'expo-router'
import { NativeTabs } from 'expo-router/unstable-native-tabs'
import React from 'react'
import { useColorScheme } from 'react-native'
import { Colors } from '@/constants/theme'

const ABOUT_BACKGROUND = '#001a34'
const BRAND_BLUE = '#1497ff'

export default function AppTabs() {
  const scheme = useColorScheme()
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme]
  const pathname = usePathname()
  const isAbout = pathname === '/about'
  const defaultTabColor = isAbout ? '#c6d4e8' : colors.textSecondary
  const selectedTabColor = isAbout ? BRAND_BLUE : colors.text

  return (
    <NativeTabs
      backgroundColor={isAbout ? ABOUT_BACKGROUND : colors.background}
      iconColor={{ default: defaultTabColor, selected: selectedTabColor }}
      indicatorColor={isAbout ? BRAND_BLUE : colors.backgroundElement}
      labelStyle={{ default: { color: defaultTabColor }, selected: { color: selectedTabColor } }}
    >
      <NativeTabs.Trigger name='index'>
        <NativeTabs.Trigger.Label>Início</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/home.png')} renderingMode='template' />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='categories'>
        <NativeTabs.Trigger.Label>Categorias</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/expo.icon/Assets/grid.png')} renderingMode='template' />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='search'>
        <NativeTabs.Trigger.Label>Busca</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf='magnifyingglass' md='search' />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='about'>
        <NativeTabs.Trigger.Label>Sobre</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf='info.circle' md='info' />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}