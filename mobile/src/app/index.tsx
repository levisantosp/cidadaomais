import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import type { ServiceGetPayload } from 'db'
import { Search } from 'lucide-react-native'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { api, type PaginatedResponse } from '@/lib/api'

const searchSchema = z.object({
  name: z.string().max(100)
})

type Service = ServiceGetPayload<{
  with: {
    category: true
  }
}>

export default function HomeScreen() {
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    mode: 'onChange',
    defaultValues: {
      name: ''
    }
  })

  const name = form.watch('name').trim()
  const shouldSearch = name.length >= 2

  const {
    isFetching,
    data: services = []
  } = useQuery({
    queryKey: ['services', name],
    enabled: shouldSearch,
    async queryFn() {
      const query = new URLSearchParams({
        limit: '50',
        name
      })
      const response = await api.get<PaginatedResponse<Service>>(`/services?${query}`)
      return response.data.data
    }
  })

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

        <Controller
          control={form.control}
          name='name'
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              className='pl-10'
              placeholder='Buscar serviço'
            />
          )}
        />

        {shouldSearch && (
          <View className='absolute left-0 right-0 top-12 z-20 rounded-2xl border border-border bg-card p-2 shadow-lg shadow-black/10'>
            {isFetching && (
              <Text className='px-3 py-2 text-sm text-muted-foreground'>Buscando...</Text>
            )}

            {!isFetching &&
              services.map((service) => (
                <Pressable
                  key={service.id.toString()}
                  className='rounded-xl px-3 py-3 active:bg-muted'
                  onPress={() => {
                    form.setValue('name', service.name)
                  }}
                >
                  <Text className='font-medium text-foreground'>{service.name}</Text>
                  <Text className='mt-1 text-sm text-muted-foreground' numberOfLines={1}>
                    {service.description}
                  </Text>
                </Pressable>
              ))}

            {!isFetching && services.length === 0 && (
              <Text className='px-3 py-2 text-sm text-muted-foreground'>Nenhum serviço encontrado</Text>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}
