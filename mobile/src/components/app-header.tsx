import { Image, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'

export function AppHeader() {
  return (
    <SafeAreaView edges={['top']} className='bg-background'>
      <View className='px-5 pb-5'>
        <View className='flex flex-row items-center justify-start gap-1'>
          <Image source={require('@/assets/images/logo.png')} className='rounded-2xl h-14 w-14' />

          <Text className='font-extrabold'>
            <Text className='text-[#0186ca]'>CIDADÃO</Text>
            <Text className='text-[#3f9731]'>MAIS</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}