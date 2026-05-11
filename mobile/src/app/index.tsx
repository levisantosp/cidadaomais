import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import type { Category, ServiceGetPayload } from 'db'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { toast } from 'sonner-native'
import { z } from 'zod'
import { AppHeader } from '@/components/app-header'
import { Loading } from '@/components/loading'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Skeleton } from '@/components/ui/skeleton'
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
  const [debouncedName, setDebouncedName] = useState('')
  const shouldSearch = debouncedName.length >= 2

  const {
    isFetching,
    data: services = [],
    error: servicesError
  } = useQuery({
    queryKey: ['services', debouncedName],
    enabled: shouldSearch,
    staleTime: 60_000,
    async queryFn() {
      const query = new URLSearchParams({
        limit: '50',
        name: debouncedName
      })
      const response = await api.get<PaginatedResponse<Service>>(`/services?${query}`)
      return response.data.data
    }
  })
  const isSearching = name.length >= 2 && (name !== debouncedName || isFetching)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedName(name)
    }, 500)

    return () => clearTimeout(timeout)
  }, [name])

  const {
    isFetching: isCategoriesFetching,
    data: categories = [],
    error: categoriesError
  } = useQuery({
    queryKey: ['categories-home'],
    staleTime: 60_000,
    async queryFn() {
      const response = await api.get<PaginatedResponse<Category>>('/categories?limit=5')
      return response.data.data
    }
  })

  const router = useRouter()

  function redirect() {
    router.push('/categories')
  }

  useEffect(() => {
    if (categoriesError || servicesError) {
      toast.error('Ocorreu um erro inesperado...', {
        description: categoriesError?.message ?? servicesError?.message
      })
    }
  }, [categoriesError, servicesError])

  return (
    <SafeAreaView className='bg-background px-4 max-w-sm'>
      <AppHeader />
      <View className='flex gap-5'>
        <Controller
          control={form.control}
          name='name'
          render={({ field }) => (
            <Command>
              <CommandInput
                placeholder='Buscar serviço'
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />

              {name.length >= 2 && (
                <CommandList>
                  {isSearching ? (
                    <CommandEmpty>
                      <Loading />
                    </CommandEmpty>
                  ) : services.length ? (
                    <CommandGroup>
                      {services.map((service) => (
                        <CommandItem
                          key={service.id.toString()}
                          value={service.name}
                          onSelect={() => {
                            form.setValue('name', service.name)
                          }}
                        >
                          <View className='flex-1'>
                            <Text className='font-medium text-foreground'>{service.name}</Text>
                            <Text className='mt-1 text-sm text-muted-foreground' numberOfLines={1}>
                              {service.description}
                            </Text>
                          </View>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : (
                    <CommandEmpty>Nenhum serviço encontrado</CommandEmpty>
                  )}
                </CommandList>
              )}
            </Command>
          )}
        />

        {isCategoriesFetching ? (
          <View className='gap-4'>
            <View className='flex-row items-center justify-between'>
              <Skeleton className='h-7 w-32 rounded-full' />
              <Skeleton className='h-10 w-24 rounded-full' />
            </View>

            <View className='flex-row flex-wrap gap-2'>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className='h-8 w-24 rounded-full' />
              ))}
            </View>
          </View>
        ) : (
          <View className='gap-4'>
            <View className='flex-row items-center justify-between'>
              <Text className='text-xl font-bold'>Categorias</Text>
              <Button onPress={redirect}>
                <Text>Ver mais</Text>
              </Button>
            </View>

            <View className='flex-row flex-wrap gap-2'>
              {categories.map((category) => (
                <View
                  key={category.id.toString()}
                  className='h-8 items-center justify-center rounded-full border border-border bg-card px-3'
                >
                  <Text
                    className='text-center text-sm font-semibold text-foreground'
                    numberOfLines={2}
                  >
                    {category.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}