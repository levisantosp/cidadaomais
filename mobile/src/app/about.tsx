import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import {
  ArrowLeft,
  ClipboardList,
  Grid2X2,
  Headphones,
  Info,
  ListOrdered,
  Search,
  ShieldCheck,
  Target
} from 'lucide-react-native'
import { Image, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'

const BRAND_BLUE = '#0186ca'
const BRAND_GREEN = '#3f9731'
const LOGO_SIZE = 72

const featureItems = [
  {
    label: 'Serviços',
    Icon: ClipboardList,
    color: BRAND_BLUE
  },
  {
    label: 'Categorias',
    Icon: Grid2X2,
    color: BRAND_GREEN
  },
  {
    label: 'Busca rápida',
    Icon: Search,
    color: BRAND_BLUE
  },
  {
    label: 'Orientações',
    Icon: Headphones,
    color: BRAND_GREEN
  }
]

export default function AboutScreen() {
  const router = useRouter()
  const theme = useTheme()

  const handleBack = () => {
    if (router.canGoBack()) {
      return router.back()
    }

    router.replace('/')
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-background'>
      <StatusBar style='light' />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='gap-3 px-4 pb-7 pt-4'>
          <View className='mb-3 flex-row items-center gap-4'>
            <Button
              accessibilityRole='button'
              accessibilityLabel='Voltar'
              onPress={handleBack}
              className='h-12 w-12'
              variant='outline'
            >
              <ArrowLeft size={20} color={theme.textSecondary} />
            </Button>

            <View className='flex-1'>
              <Text className='text-3xl font-extrabold text-foreground'>Sobre</Text>
              <Text className='mt-1 text-base text-muted-foreground'>Conheça o CidadãoMais</Text>
            </View>
          </View>

          <View className='min-h-32 flex-row items-center gap-4 rounded-2xl border border-border bg-card px-4 py-4'>
            <View className='h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl'>
              <Image
                source={require('@/assets/images/logo.png')}
                resizeMode='contain'
                style={{
                  width: LOGO_SIZE,
                  height: LOGO_SIZE,
                  borderRadius: 18
                }}
              />
            </View>

            <View className='min-w-0 flex-1'>
              <Text
                className='text-3xl font-black leading-9'
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                <Text className='text-[#0186ca]'>CIDADÃO</Text>
                <Text className='text-[#3f9731]'>MAIS</Text>
              </Text>

              <Text className='mt-2 text-base leading-6 text-foreground'>
                Aplicativo que orienta cidadãos sobre serviços públicos, documentos, órgãos e
                unidades de atendimento.
              </Text>
            </View>
          </View>

          <View className='rounded-2xl border border-border bg-card p-4'>
            <View className='flex-row items-center gap-4'>
              <View className='h-20 w-20 items-center justify-center rounded-full border border-border bg-primary/10'>
                <Target size={48} color={BRAND_GREEN} strokeWidth={2.2} />
              </View>

              <View className='min-w-0 flex-1'>
                <Text className='text-xl font-extrabold text-foreground'>Nossa missão</Text>
                <Text className='mt-1 text-sm leading-6 text-muted-foreground'>
                  Facilitar o acesso à informação, orientar o usuário e conectar o cidadão aos
                  canais oficiais de atendimento.
                </Text>
              </View>
            </View>
          </View>

          <View className='rounded-2xl border border-border bg-card p-4'>
            <Text className='text-xl font-extrabold text-foreground'>O que você encontra aqui</Text>

            <View className='mt-4 flex-row gap-3'>
              {featureItems.map(({ label, Icon, color }) => (
                <View
                  key={label}
                  className='min-h-24 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-muted px-1.5 py-3'
                >
                  <Icon size={38} color={color} strokeWidth={2.1} />
                  <Text
                    className='text-center text-sm font-semibold leading-5 text-foreground'
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.72}
                  >
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className='rounded-2xl border border-border bg-card p-4'>
            <View className='flex-row items-center gap-4'>
              <View className='h-20 w-20 items-center justify-center rounded-full border border-border bg-primary/10'>
                <ListOrdered size={45} color={BRAND_BLUE} strokeWidth={2.2} />
              </View>

              <View className='min-w-0 flex-1'>
                <Text className='text-xl font-extrabold text-foreground'>Como funciona</Text>
                <Text className='mt-1 text-sm leading-6 text-muted-foreground'>
                  1. Pesquise o serviço
                </Text>
                <Text className='text-sm leading-6 text-muted-foreground'>
                  2. Consulte os requisitos
                </Text>
                <Text className='text-sm leading-6 text-muted-foreground'>
                  3. Acesse o canal oficial
                </Text>
              </View>
            </View>
          </View>

          <View className='rounded-2xl border border-border bg-card p-4'>
            <View className='flex-row items-center gap-4'>
              <View className='h-20 w-20 items-center justify-center rounded-full border border-border bg-accent/10'>
                <ShieldCheck size={46} color={BRAND_GREEN} strokeWidth={2.1} />
              </View>

              <View className='min-w-0 flex-1'>
                <Text className='text-xl font-extrabold text-foreground'>Importante</Text>
                <Text className='mt-1 text-sm leading-6 text-muted-foreground'>
                  O CidadãoMais não substitui os órgãos oficiais. As informações devem ser
                  confirmadas nos canais responsáveis.
                </Text>
              </View>
            </View>
          </View>

          <View className='min-h-16 flex-row items-center gap-5 rounded-2xl border border-border bg-card p-4'>
            <View>
              <Info size={27} color='#ffffff' strokeWidth={2.4} />
            </View>

            <View className='flex-1'>
              <Text className='text-base font-extrabold text-foreground'>Versão 1.0</Text>
              <Text className='text-sm text-muted-foreground'>Projeto acadêmico</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}