import { Search } from 'lucide-react-native'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input } from '@/components/ui/input'

export default function HomeScreen() {
  return (
    <SafeAreaView className='bg-background px-4'>
      <View className='relative'>
        <Search
          pointerEvents='none'
          size={20}
          color='#737373'
          style={{
            position: 'absolute',
            left: 12,
            top: 10
          }}
        />
        <Input className='pl-10' placeholder='Buscar serviço' />
      </View>
    </SafeAreaView>
  )
}