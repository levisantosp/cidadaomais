import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import type { Category, ServiceGetPayload } from 'db'
import { useRouter } from 'expo-router'
import {
  Building2,
  ClipboardList,
  FileCheck2,
  FileSearch,
  Grid2X2,
  IdCard,
  Info,
  ShieldCheck
} from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, ScrollView, View } from 'react-native'
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

const BRAND_BLUE = '#0186ca'
const BRAND_GREEN = '#3f9731'

const searchSchema = z.object({
  name: z.string().max(100)
})

type Service = ServiceGetPayload<{
  with: {
    category: true
  }
}>

const quickActions = [
  {
    label: 'Serviços',
    description: 'Lista completa',
    route: '/services',
    Icon: ClipboardList,
    color: BRAND_BLUE
  },
  {
    label: 'Categorias',
    description: 'Áreas de atendimento',
    route: '/categories',
    Icon: Grid2X2,
    color: BRAND_GREEN
  },
  {
    label: 'Sobre',
    description: 'Projeto e versão',
    route: '/about',
    Icon: Info,
    color: BRAND_BLUE
  }
] as const

function getServiceVisual(service: Service) {
  const text = `${service.name} ${service.category?.name ?? ''}`.toLowerCase()

  if (text.includes('cpf') || text.includes('rg') || text.includes('document')) {
    return {
      Icon: IdCard,
      color: BRAND_GREEN,
      className: 'bg-accent/15'
    }
  }

  if (text.includes('consulta') || text.includes('cadastro')) {
    return {
      Icon: FileSearch,
      color: BRAND_BLUE,
      className: 'bg-primary/15'
    }
  }

  if (text.includes('órgão') || text.includes('orgao') || text.includes('prefeitura')) {
    return {
      Icon: Building2,
      color: BRAND_BLUE,
      className: 'bg-primary/15'
    }
  }

  return {
    Icon: FileCheck2,
    color: BRAND_GREEN,
    className: 'bg-accent/15'
  }
}

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
    data: searchServices = [],
    error: searchServicesError
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

  const {
    isFetching: isFeaturedServicesFetching,
    data: featuredServices = [],
    error: featuredServicesError
  } = useQuery({
    queryKey: ['services-home-preview'],
    staleTime: 60_000,
    async queryFn() {
      const query = new URLSearchParams({
        limit: '4',
        page: '1'
      })
      const response = await api.get<PaginatedResponse<Service>>(`/services?${query}`)
      return response.data.data
    }
  })

  const router = useRouter()

  function goToCategories() {
    router.push('/categories')
  }

  function goToServices() {
    router.push('/services')
  }

  useEffect(() => {
    if (categoriesError || searchServicesError || featuredServicesError) {
      toast.error('Ocorreu um erro inesperado...', {
        description:
          categoriesError?.message ?? searchServicesError?.message ?? featuredServicesError?.message
      })
    }
  }, [categoriesError, featuredServicesError, searchServicesError])

  return (
    <SafeAreaView className='max-w-sm flex-1 bg-background px-4'>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
        <AppHeader />
        <View className='gap-6 pb-8'>
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
                    ) : searchServices.length ? (
                      <CommandGroup>
                        {searchServices.map((service) => (
                          <CommandItem
                            key={service.id.toString()}
                            value={service.name}
                            onSelect={() => {
                              form.setValue('name', service.name)
                            }}
                          >
                            <View className='flex-1'>
                              <Text className='font-medium text-foreground'>{service.name}</Text>
                              <Text
                                className='mt-1 text-sm text-muted-foreground'
                                numberOfLines={1}
                              >
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

          <View className='gap-3'>
            <Text className='text-xl font-bold text-foreground'>Acesso rápido</Text>

            <View className='flex-row gap-3'>
              {quickActions.map(({ label, description, route, Icon, color }) => (
                <Pressable
                  key={label}
                  accessibilityRole='button'
                  accessibilityLabel={label}
                  onPress={() => router.push(route)}
                  className='min-h-32 min-w-0 flex-1 rounded-2xl border border-border bg-card px-4 py-4 active:opacity-75'
                >
                  <View className='h-12 w-12 items-center justify-center rounded-2xl bg-primary/10'>
                    <Icon size={27} color={color} strokeWidth={2.2} />
                  </View>

                  <Text
                    className='mt-4 text-base font-extrabold text-foreground'
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                  >
                    {label}
                  </Text>
                  <Text className='mt-2 text-xs leading-4 text-muted-foreground' numberOfLines={2}>
                    {description}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className='rounded-2xl border border-primary/40 bg-primary/10 p-4'>
            <View className='flex-row items-center gap-4'>
              <View className='h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/20'>
                <ShieldCheck size={31} color={BRAND_BLUE} strokeWidth={2.2} />
              </View>

              <View className='min-w-0 flex-1'>
                <Text className='text-lg font-extrabold text-foreground'>Antes de solicitar</Text>
                <Text className='mt-1 text-sm leading-5 text-muted-foreground'>
                  Confira documentos, requisitos e orientações no serviço escolhido.
                </Text>
              </View>
            </View>
          </View>

          <View className='gap-4'>
            <View className='flex-row items-center justify-between gap-3'>
              <View className='min-w-0 flex-1'>
                <Text className='text-xl font-bold text-foreground'>Serviços disponíveis</Text>
                <Text className='mt-1 text-sm text-muted-foreground'>
                  Consulte informações principais
                </Text>
              </View>

              <Button onPress={goToServices} variant='outline'>
                <Text>Ver mais</Text>
              </Button>
            </View>

            {isFeaturedServicesFetching ? (
              <View className='gap-3'>
                {Array.from({ length: 3 }).map((_, index) => (
                  <View
                    key={index}
                    className='min-h-24 flex-row items-center gap-4 rounded-2xl border border-border bg-card px-4 py-4'
                  >
                    <Skeleton className='h-14 w-14 rounded-2xl' />
                    <View className='flex-1 gap-3'>
                      <Skeleton className='h-5 w-3/4 rounded-full' />
                      <Skeleton className='h-4 w-full rounded-full' />
                    </View>
                  </View>
                ))}
              </View>
            ) : featuredServices.length ? (
              <View className='gap-3'>
                {featuredServices.map((service) => {
                  const visual = getServiceVisual(service)
                  const Icon = visual.Icon

                  return (
                    <View
                      key={service.id.toString()}
                      className='min-h-24 flex-row items-center gap-4 rounded-2xl border border-border bg-card px-4 py-4'
                    >
                      <View
                        className={`h-14 w-14 items-center justify-center rounded-2xl border border-border ${visual.className}`}
                      >
                        <Icon size={30} color={visual.color} strokeWidth={2.1} />
                      </View>

                      <View className='min-w-0 flex-1'>
                        <View className='mb-2 flex-row items-center gap-2'>
                          <Text
                            className='min-w-0 flex-1 text-base font-extrabold text-foreground'
                            numberOfLines={1}
                          >
                            {service.name}
                          </Text>

                          <View className='max-w-32 items-center justify-center rounded-full border border-primary/40 bg-[#eaf7fd] px-3 py-1'>
                            <Text
                              className='text-xs font-bold leading-4 text-[#0186ca]'
                              numberOfLines={1}
                              adjustsFontSizeToFit
                            >
                              {service.category?.name ?? 'Serviço'}
                            </Text>
                          </View>
                        </View>

                        <Text className='text-sm leading-5 text-muted-foreground' numberOfLines={2}>
                          {service.description}
                        </Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            ) : (
              <View className='rounded-2xl border border-border bg-card p-5'>
                <Text className='text-center text-sm font-semibold text-muted-foreground'>
                  Nenhum serviço disponível
                </Text>
              </View>
            )}
          </View>

          {isCategoriesFetching ? (
            <View className='gap-4'>
              <View className='flex-row items-center justify-between'>
                <Skeleton className='h-7 w-44 rounded-full' />
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
              <View className='flex-row items-center justify-between gap-3'>
                <View className='min-w-0 flex-1'>
                  <Text className='text-xl font-bold text-foreground'>Categorias</Text>
                  <Text className='mt-1 text-sm text-muted-foreground'>
                    Navegue por área de atendimento
                  </Text>
                </View>

                <Button onPress={goToCategories} variant='outline'>
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
      </ScrollView>
    </SafeAreaView>
  )
}