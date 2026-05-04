import { useQuery } from '@tanstack/react-query'
import type { Category } from 'db'
import { useRouter } from 'expo-router'
import { ArrowLeft, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react-native'
import { Pressable, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'
import { api, PaginatedResponse } from '@/lib/api'

const BRAND_BLUE = '#0186ca'

export default function CategoriesScreen() {
  const router = useRouter()
  const theme = useTheme()

  const {
    isFetching,
    error,
    data: categories
  } = useQuery({
    queryKey: ['categories'],
    async queryFn() {
      const response = await api.get<PaginatedResponse<Category>>('/categories')
      return response.data.data
    }
  })

  const handleBack = () => {
    if (router.canGoBack()) {
      return router.back()
    }

    router.replace('/')
  }

  return (
    <SafeAreaView className='flex-1 bg-background px-4'>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
        <View className='pb-8'>
          <View className='mt-2 flex-row items-start justify-between'>
            <View className='flex-1 flex-row items-start gap-3 pr-3'>
              <Pressable
                accessibilityRole='button'
                accessibilityLabel='Voltar'
                onPress={handleBack}
                className='h-12 w-12 items-center justify-center rounded-full border border-border bg-card'
              >
                <ArrowLeft size={20} color={theme.textSecondary} />
              </Pressable>

              <View className='flex-1 pt-1'>
                <Text className='text-3xl font-extrabold text-foreground'>Categorias</Text>
                <Text className='mt-1 text-base text-muted-foreground'>Explore os servicos por area</Text>
              </View>
            </View>

            <Pressable
              accessibilityRole='button'
              accessibilityLabel='Filtrar categorias'
              className='h-12 w-12 items-center justify-center rounded-full border border-border bg-card'
            >
              <SlidersHorizontal size={20} color={BRAND_BLUE} />
            </Pressable>
          </View>

          <View className='mt-5'>
            <View className='relative'>
              <Search
                pointerEvents='none'
                size={20}
                color={theme.textSecondary}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: 14,
                  zIndex: 1
                }}
              />
              <SlidersHorizontal
                pointerEvents='none'
                size={20}
                color={BRAND_BLUE}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 14,
                  zIndex: 1
                }}
              />
              <Input className='h-12 rounded-2xl pl-10 pr-12' placeholder='Buscar categoria' />
            </View>
          </View>

          <View className='mt-4 rounded-2xl border border-primary/40 bg-primary/10 p-4'>
            <View className='flex-row items-start gap-3'>
              <View className='h-12 w-12 items-center justify-center rounded-full bg-primary/15'>
                <ShieldCheck size={24} color={BRAND_BLUE} />
              </View>

              <View className='flex-1'>
                <Text className='text-lg font-semibold text-foreground'>Selecione uma categoria para continuar</Text>
                <Text className='mt-1 text-base text-muted-foreground'>
                  Encontre rapidamente o servico que voce precisa.
                </Text>
              </View>
            </View>
          </View>

          <View className='mt-4 flex-row flex-wrap justify-between gap-y-4'>
            {!categories && <Text>pinto</Text>}
            {categories?.length &&
              categories.map((category) => {
                return (
                  <Pressable key={category.id} className='w-[48.5%] rounded-3xl border border-border bg-card p-4'>
                    <Text className='mt-4 text-lg font-semibold text-foreground'>{category.name}</Text>
                    <Text className='mt-1 min-h-14 text-sm leading-6 text-muted-foreground'>
                      {category.description}
                    </Text>
                  </Pressable>
                )
              })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}