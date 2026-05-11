import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import type { ServiceGetPayload } from 'db'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { z } from 'zod'
import { AppHeader } from '@/components/app-header'
import { Loading } from '@/components/loading'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
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

  const { isFetching, data: services = [] } = useQuery({
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

  return (
    <SafeAreaView className='bg-background px-4'>
      <AppHeader />
      <View>
        <Controller
          control={form.control}
          name='name'
          render={({ field }) => (
            <Command className='rounded-2xl'>
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
      </View>
    </SafeAreaView>
  )
}