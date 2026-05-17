import { useQuery } from '@tanstack/react-query'
import type { Service } from 'db'
import { useRouter, useSearchParams } from 'expo-router'
import { ArrowLeft, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'
import { api, type PaginatedResponse } from '@/lib/api'

const BRAND_BLUE = '#0186ca'

interface ServiceWithCategory extends Service {
  category: {
    id: bigint
    name: string
    description: string
  }
}

export default function ServicesScreen() {
  const router = useRouter()
  const theme = useTheme()
  const params = useSearchParams()
  const categoryId = params.get('categoryId')
  const categoryName = params.get('categoryName')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    isFetching,
    error,
    data: services = []
  } = useQuery({
    queryKey: ['services', categoryId, searchQuery],
    async queryFn() {
      const query = new URLSearchParams({
        limit: '50',
        ...(searchQuery && { name: searchQuery })
      })
      const response = await api.get<PaginatedResponse<ServiceWithCategory>>(`/services?${query}`)

      // Filter by categoryId if provided
      if (categoryId) {
        return response.data.data.filter((service) => service.categoryId.toString() === categoryId)
      }
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
                <Text className='text-3xl font-extrabold text-foreground'>Serviços</Text>
                {categoryName && (
                  <Text className='mt-1 text-base text-muted-foreground'>
                    Categoria: <Text className='font-semibold text-primary'>{categoryName}</Text>
                  </Text>
                )}
              </View>
            </View>

            <Pressable
              accessibilityRole='button'
              accessibilityLabel='Filtrar serviços'
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
              <Input
                className='h-12 rounded-2xl pl-10 pr-12'
                placeholder='Buscar serviço em documentos'
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          <View className='mt-4 rounded-2xl border border-primary/40 bg-primary/10 p-4'>
            <View className='flex-row items-start gap-3'>
              <View className='h-12 w-12 items-center justify-center rounded-full bg-primary/15'>
                <ShieldCheck size={24} color={BRAND_BLUE} />
              </View>

              <View className='flex-1'>
                <Text className='text-lg font-semibold text-foreground'>
                  {services.length} serviços encontrados
                </Text>
                <Text className='mt-1 text-base text-muted-foreground'>
                  Selecione um serviço para ver os detalhes.
                </Text>
              </View>
            </View>
          </View>

          <View className='mt-6 gap-3'>
            {services.length > 0 ? (
              services.map((service) => (
                <Pressable
                  key={service.id.toString()}
                  onPress={() =>
                    router.push({
                      pathname: '/service-detail',
                      params: { serviceId: service.id.toString() }
                    })
                  }
                  className='rounded-2xl border border-border bg-card p-4'
                >
                  <View className='flex-row items-start justify-between'>
                    <View className='flex-1 gap-2'>
                      <Text className='text-lg font-semibold text-foreground'>{service.name}</Text>
                      <Text className='text-sm text-muted-foreground' numberOfLines={2}>
                        {service.description}
                      </Text>
                    </View>

                    {/* Badge with service type/status */}
                    <View className='ml-3 rounded-full bg-primary/10 px-3 py-1'>
                      <Text className='text-xs font-semibold text-primary'>Popular</Text>
                    </View>
                  </View>
                </Pressable>
              ))
            ) : (
              <View className='rounded-2xl border border-border bg-card p-6'>
                <Text className='text-center text-lg font-semibold text-muted-foreground'>
                  Nenhum serviço encontrado
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}