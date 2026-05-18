import { useQuery } from '@tanstack/react-query'
import type { ServiceGetPayload } from 'db'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  CircleHelp,
  FileCheck2,
  FileSearch,
  IdCard,
  Search,
  ShieldCheck
} from 'lucide-react-native'
import { useEffect, useMemo, useState } from 'react'
import { Pressable, RefreshControl, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { toast } from 'sonner-native'
import { Button } from '@/components/ui/button'
import { Command, CommandInput } from '@/components/ui/command'
import { Skeleton } from '@/components/ui/skeleton'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'
import { api, type PaginatedResponse } from '@/lib/api'

const BRAND_BLUE = '#0186ca'
const BRAND_GREEN = '#3f9731'
const SEARCH_LIMIT = 20

type Service = ServiceGetPayload<{
  with: {
    category: true
  }
}>

function pluralizeResults(count: number) {
  return count === 1 ? '1 resultado encontrado' : `${count} resultados encontrados`
}

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

function ResultSkeleton() {
  return (
    <View className='gap-3'>
      {Array.from({ length: 4 }).map((_, index) => (
        <View
          key={index}
          className='min-h-24 flex-row items-center gap-4 rounded-2xl border border-border bg-card p-4'
        >
          <Skeleton className='h-14 w-14 rounded-2xl' />
          <View className='flex-1 gap-3'>
            <Skeleton className='h-5 w-3/4 rounded-full' />
            <Skeleton className='h-4 w-full rounded-full' />
            <Skeleton className='h-4 w-1/2 rounded-full' />
          </View>
          <Skeleton className='h-8 w-8 rounded-full' />
        </View>
      ))}
    </View>
  )
}

export default function SearchScreen() {
  const router = useRouter()
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null)
  const trimmedTerm = searchTerm.trim()
  const shouldSearchByName = debouncedTerm.length >= 2
  const canFetchServices = debouncedTerm.length === 0 || shouldSearchByName

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedTerm(trimmedTerm)
    }, 400)

    return () => clearTimeout(timeout)
  }, [trimmedTerm])

  useEffect(() => {
    setExpandedServiceId(null)
  }, [debouncedTerm])

  const { data, error, isFetching, isLoading, refetch } = useQuery({
    queryKey: ['services-search', debouncedTerm],
    enabled: canFetchServices,
    staleTime: 60_000,
    async queryFn() {
      const query = new URLSearchParams({
        limit: SEARCH_LIMIT.toString(),
        page: '1'
      })

      if (shouldSearchByName) {
        query.set('name', debouncedTerm)
      }

      const response = await api.get<PaginatedResponse<Service>>(`/services?${query}`)
      return response.data
    }
  })

  useEffect(() => {
    if (error) {
      toast.error('Não foi possível buscar serviços.', {
        description: error.message
      })
    }
  }, [error])

  const services = data?.data ?? []
  const isTypingSearch = trimmedTerm.length >= 2 && trimmedTerm !== debouncedTerm
  const isTooShortSearch = trimmedTerm.length > 0 && trimmedTerm.length < 2
  const isRefreshing = isFetching && !isLoading && !isTypingSearch

  const resultLabel = useMemo(() => {
    if (isTooShortSearch) {
      return 'Continue digitando'
    }

    if (!debouncedTerm) {
      return 'Busca de serviços'
    }

    if (data?.hasNextPage) {
      return `Mais de ${services.length} resultados encontrados`
    }

    return pluralizeResults(services.length)
  }, [data?.hasNextPage, debouncedTerm, isTooShortSearch, services.length])

  const helperText = useMemo(() => {
    if (isTooShortSearch) {
      return 'Digite pelo menos 2 caracteres para pesquisar.'
    }

    if (!debouncedTerm) {
      return 'Pesquise por nome para encontrar um serviço.'
    }

    if (services.length) {
      return 'Selecione um serviço para consultar informações importantes.'
    }

    return 'Tente outro termo ou navegue por categorias.'
  }, [debouncedTerm, isTooShortSearch, services.length])

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace('/')
  }

  const goToCategories = () => {
    router.push('/categories')
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-background'>
      <StatusBar style='light' />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              void refetch()
            }}
            tintColor={BRAND_BLUE}
            colors={[BRAND_BLUE]}
          />
        }
      >
        <View className='px-4 pb-7 pt-4'>
          <View className='flex-row items-start justify-between'>
            <View className='flex-1 flex-row items-start gap-4 pr-3'>
              <Button
                accessibilityRole='button'
                accessibilityLabel='Voltar'
                onPress={handleBack}
                className='h-12 w-12'
                variant='outline'
              >
                <ArrowLeft size={20} color={theme.textSecondary} />
              </Button>

              <View className='min-w-0 flex-1'>
                <Text className='text-3xl font-extrabold text-foreground'>Busca</Text>
                <Text className='mt-1 text-base text-muted-foreground'>
                  Encontre serviços, documentos e órgãos
                </Text>
              </View>
            </View>
          </View>

          <View className='mt-6'>
            <Command>
              <CommandInput
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder='Buscar serviço'
                returnKeyType='search'
                autoCapitalize='none'
                autoCorrect={false}
              />
            </Command>
          </View>

          <View className='mt-5 rounded-2xl border border-primary/40 bg-primary/10 p-4'>
            <View className='flex-row items-center gap-4'>
              <View className='h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/20'>
                <ShieldCheck size={31} color={BRAND_BLUE} strokeWidth={2.2} />
              </View>

              <View className='min-w-0 flex-1'>
                <Text className='text-lg font-extrabold text-foreground'>{resultLabel}</Text>
                <Text className='mt-1 text-sm leading-5 text-muted-foreground'>{helperText}</Text>
              </View>
            </View>
          </View>

          <View className='mt-4'>
            {isTooShortSearch ? (
              <View className='items-center rounded-2xl border border-border bg-card p-6'>
                <View className='h-16 w-16 items-center justify-center rounded-full bg-primary/15'>
                  <Search size={32} color={BRAND_BLUE} strokeWidth={2.1} />
                </View>

                <Text className='mt-4 text-center text-xl font-extrabold text-foreground'>
                  Continue digitando
                </Text>
                <Text className='mt-2 text-center text-sm leading-6 text-muted-foreground'>
                  Use pelo menos 2 caracteres para consultar a lista de serviços.
                </Text>
              </View>
            ) : isLoading || isTypingSearch ? (
              <ResultSkeleton />
            ) : services.length ? (
              <View className='gap-3'>
                {services.map((service) => {
                  const visual = getServiceVisual(service)
                  const Icon = visual.Icon
                  const serviceId = service.id.toString()
                  const isExpanded = expandedServiceId === serviceId

                  return (
                    <View
                      key={serviceId}
                      className='overflow-hidden rounded-2xl border border-border bg-card'
                    >
                      <Pressable
                        accessibilityRole='button'
                        accessibilityLabel={`Ver detalhes de ${service.name}`}
                        onPress={() => setExpandedServiceId(isExpanded ? null : serviceId)}
                        className='min-h-24 flex-row items-center gap-4 p-4 active:opacity-75'
                      >
                        <View
                          className={`h-16 w-16 items-center justify-center rounded-2xl border border-border ${visual.className}`}
                        >
                          <Icon size={34} color={visual.color} strokeWidth={2.1} />
                        </View>

                        <View className='min-w-0 flex-1'>
                          <View className='mb-2 flex-row items-center gap-2'>
                            <Text
                              className='min-w-0 flex-1 text-lg font-extrabold text-foreground'
                              numberOfLines={1}
                            >
                              {service.name}
                            </Text>

                            <View className='rounded-full border border-primary/40 bg-primary/10 px-3 py-1'>
                              <Text
                                className='text-xs font-bold text-[#0186ca]'
                                numberOfLines={1}
                                adjustsFontSizeToFit
                              >
                                {service.category?.name ?? 'Serviço'}
                              </Text>
                            </View>
                          </View>

                          <Text
                            className='text-sm leading-5 text-muted-foreground'
                            numberOfLines={2}
                          >
                            {service.description}
                          </Text>

                          {service.requirements?.length ? (
                            <View className='mt-2 flex-row items-center gap-2'>
                              <CircleHelp size={14} color={theme.textSecondary} />
                              <Text className='text-xs font-medium text-muted-foreground'>
                                {service.requirements.length === 1
                                  ? '1 requisito'
                                  : `${service.requirements.length} requisitos`}
                              </Text>
                            </View>
                          ) : null}
                        </View>

                        <View style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}>
                          <ChevronRight size={25} color={theme.textSecondary} strokeWidth={2.2} />
                        </View>
                      </Pressable>

                      {isExpanded ? (
                        <View className='gap-4 border-t border-border px-4 pb-4 pt-3'>
                          <View>
                            <Text className='text-sm font-extrabold text-foreground'>
                              Orientações
                            </Text>
                            <Text className='mt-1 text-sm leading-6 text-muted-foreground'>
                              {service.guidelines}
                            </Text>
                          </View>

                          {service.requirements.length ? (
                            <View>
                              <Text className='text-sm font-extrabold text-foreground'>
                                Requisitos
                              </Text>
                              <View className='mt-2 gap-2'>
                                {service.requirements.slice(0, 4).map((requirement) => (
                                  <View key={requirement} className='flex-row gap-2'>
                                    <View className='mt-2 h-1.5 w-1.5 rounded-full bg-accent' />
                                    <Text className='flex-1 text-sm leading-5 text-muted-foreground'>
                                      {requirement}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            </View>
                          ) : null}
                        </View>
                      ) : null}
                    </View>
                  )
                })}
              </View>
            ) : (
              <View className='items-center rounded-2xl border border-border bg-card p-6'>
                <View className='h-16 w-16 items-center justify-center rounded-full bg-primary/15'>
                  <Search size={32} color={BRAND_BLUE} strokeWidth={2.1} />
                </View>

                <Text className='mt-4 text-center text-xl font-extrabold text-foreground'>
                  Nenhum serviço encontrado
                </Text>
                <Text className='mt-2 text-center text-sm leading-6 text-muted-foreground'>
                  Revise o termo buscado ou explore a lista de categorias.
                </Text>

                <Pressable
                  accessibilityRole='button'
                  accessibilityLabel='Ver categorias'
                  onPress={goToCategories}
                  className='mt-5 h-11 flex-row items-center justify-center gap-2 rounded-full bg-primary px-5 active:opacity-80'
                >
                  <Text className='font-bold text-primary-foreground'>Ver categorias</Text>
                  <ChevronRight size={19} color='#ffffff' strokeWidth={2.4} />
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}