import { useRouter } from 'expo-router'
import {
  ArrowLeft,
  BriefcaseBusiness,
  ChevronRight,
  FileText,
  GraduationCap,
  HandCoins,
  HeartPulse,
  Landmark,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  type LucideIcon
} from 'lucide-react-native'
import { Pressable, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'

type CategoryTone = 'primary' | 'success'

type CategoryItem = {
  id: string
  title: string
  subtitle: string
  servicesCount: number
  icon: LucideIcon
  tone: CategoryTone
}

const CATEGORIES_MOCK: CategoryItem[] = [
  {
    id: 'documents',
    title: 'Documentos',
    subtitle: 'RG, CPF, certidoes e mais',
    servicesCount: 12,
    icon: FileText,
    tone: 'primary'
  },
  {
    id: 'health',
    title: 'Saude',
    subtitle: 'SUS, vacinacao e atendimento',
    servicesCount: 8,
    icon: HeartPulse,
    tone: 'success'
  },
  {
    id: 'education',
    title: 'Educacao',
    subtitle: 'Matricula, ENEM e programas',
    servicesCount: 7,
    icon: GraduationCap,
    tone: 'primary'
  },
  {
    id: 'benefits',
    title: 'Beneficios',
    subtitle: 'Auxilios e programas sociais',
    servicesCount: 9,
    icon: HandCoins,
    tone: 'success'
  },
  {
    id: 'work',
    title: 'Trabalho',
    subtitle: 'CTPS, emprego e orientacao',
    servicesCount: 6,
    icon: BriefcaseBusiness,
    tone: 'primary'
  },
  {
    id: 'retirement',
    title: 'Previdencia',
    subtitle: 'INSS, aposentadoria e pensoes',
    servicesCount: 5,
    icon: Landmark,
    tone: 'success'
  }
]

const BRAND_BLUE = '#0186ca'
const BRAND_GREEN = '#3f9731'

function getToneColor(tone: CategoryTone) {
  return tone === 'success' ? BRAND_GREEN : BRAND_BLUE
}

export default function CategoriesScreen() {
  const router = useRouter()
  const theme = useTheme()

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
      return
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
            {CATEGORIES_MOCK.map((category) => {
              const Icon = category.icon
              const toneColor = getToneColor(category.tone)

              return (
                <Pressable key={category.id} className='w-[48.5%] rounded-3xl border border-border bg-card p-4'>
                  <View className='flex-row items-start justify-between'>
                    <View
                      className='h-14 w-14 items-center justify-center rounded-2xl border border-border'
                      style={{ backgroundColor: `${toneColor}1F` }}
                    >
                      <Icon size={28} color={toneColor} />
                    </View>

                    <ChevronRight size={22} color={theme.textSecondary} />
                  </View>

                  <Text className='mt-4 text-2xl font-semibold text-foreground'>{category.title}</Text>
                  <Text className='mt-1 min-h-14 text-base leading-6 text-muted-foreground'>{category.subtitle}</Text>

                  <View className='mt-4 self-start rounded-full px-3 py-1' style={{ backgroundColor: `${toneColor}26` }}>
                    <Text className='font-medium' style={{ color: toneColor }}>
                      {category.servicesCount} servicos
                    </Text>
                  </View>
                </Pressable>
              )
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
