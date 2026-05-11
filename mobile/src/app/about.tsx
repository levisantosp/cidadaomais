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
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'

const BRAND_BLUE = '#1497ff'
const BRAND_GREEN = '#69d46f'
const SCREEN_BACKGROUND = '#001a34'
const CARD_BACKGROUND = 'rgba(3, 33, 64, 0.82)'
const CARD_BORDER = 'rgba(39, 143, 229, 0.5)'
const TEXT_PRIMARY = '#f7fbff'
const TEXT_SECONDARY = '#c6d4e8'

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

  const handleBack = () => {
    if (router.canGoBack()) {
      return router.back()
    }

    router.replace('/')
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <StatusBar style='light' />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole='button'
            accessibilityLabel='Voltar'
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <ArrowLeft size={26} color={TEXT_SECONDARY} strokeWidth={2.4} />
          </Pressable>

          <View style={styles.headerCopy}>
            <Text style={styles.title}>Sobre</Text>
            <Text style={styles.subtitle}>Conheça o CidadãoMais</Text>
          </View>
        </View>

        <View style={[styles.card, styles.heroCard]}>
          <Image source={require('@/assets/images/logo.png')} resizeMode='contain' style={styles.logo} />

          <View style={styles.heroText}>
            <Text style={styles.brandTitle} numberOfLines={1} adjustsFontSizeToFit>
              <Text style={styles.brandBlue}>CIDADÃO</Text>
              <Text style={styles.brandGreen}>MAIS</Text>
            </Text>

            <Text style={styles.heroDescription}>
              Aplicativo que orienta cidadãos sobre serviços públicos, documentos, órgãos e unidades de atendimento.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Target size={48} color={BRAND_GREEN} strokeWidth={2.2} />
            </View>

            <View style={styles.rowText}>
              <Text style={styles.sectionTitle}>Nossa missão</Text>
              <Text style={styles.bodyText}>
                Facilitar o acesso à informação, orientar o usuário e conectar o cidadão aos canais oficiais de
                atendimento.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>O que você encontra aqui</Text>

          <View style={styles.featureGrid}>
            {featureItems.map(({ label, Icon, color }) => (
              <View key={label} style={styles.featureTile}>
                <Icon size={38} color={color} strokeWidth={2.1} />
                <Text style={styles.featureLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <ListOrdered size={45} color={BRAND_BLUE} strokeWidth={2.2} />
            </View>

            <View style={styles.rowText}>
              <Text style={styles.sectionTitle}>Como funciona</Text>
              <Text style={styles.bodyText}>1. Pesquise o serviço</Text>
              <Text style={styles.bodyText}>2. Consulte os requisitos</Text>
              <Text style={styles.bodyText}>3. Acesse o canal oficial</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.iconCircle, styles.greenIconCircle]}>
              <ShieldCheck size={46} color={BRAND_GREEN} strokeWidth={2.1} />
            </View>

            <View style={styles.rowText}>
              <Text style={styles.sectionTitle}>Importante</Text>
              <Text style={styles.bodyText}>
                O CidadãoMais não substitui os órgãos oficiais. As informações devem ser confirmadas nos canais
                responsáveis.
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, styles.versionCard]}>
          <View style={styles.smallIconCircle}>
            <Info size={27} color={TEXT_PRIMARY} strokeWidth={2.4} />
          </View>

          <View style={styles.versionText}>
            <Text style={styles.versionTitle}>Versão 1.0</Text>
            <Text style={styles.versionSubtitle}>Projeto acadêmico</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SCREEN_BACKGROUND
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 28,
    gap: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginBottom: 12
  },
  backButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(8, 39, 72, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(91, 147, 194, 0.32)'
  },
  pressed: {
    opacity: 0.72
  },
  headerCopy: {
    flex: 1
  },
  title: {
    color: TEXT_PRIMARY,
    fontSize: 33,
    lineHeight: 39,
    fontWeight: '800'
  },
  subtitle: {
    color: '#aebbd0',
    marginTop: 3,
    fontSize: 17,
    lineHeight: 22
  },
  card: {
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 18,
    backgroundColor: CARD_BACKGROUND,
    padding: 15
  },
  heroCard: {
    minHeight: 130,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 17,
    paddingVertical: 18
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 22
  },
  heroText: {
    flex: 1,
    minWidth: 0
  },
  brandTitle: {
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '900'
  },
  brandBlue: {
    color: BRAND_BLUE
  },
  brandGreen: {
    color: BRAND_GREEN
  },
  heroDescription: {
    color: TEXT_PRIMARY,
    marginTop: 6,
    fontSize: 16,
    lineHeight: 24
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18
  },
  rowText: {
    flex: 1,
    minWidth: 0
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18, 64, 107, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(64, 139, 208, 0.38)'
  },
  greenIconCircle: {
    backgroundColor: 'rgba(17, 91, 87, 0.54)'
  },
  sectionTitle: {
    color: TEXT_PRIMARY,
    fontSize: 21,
    lineHeight: 28,
    fontWeight: '800'
  },
  bodyText: {
    color: TEXT_SECONDARY,
    marginTop: 2,
    fontSize: 15,
    lineHeight: 22
  },
  featureGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16
  },
  featureTile: {
    flex: 1,
    minHeight: 88,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(84, 151, 209, 0.42)',
    backgroundColor: 'rgba(7, 42, 78, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 10
  },
  featureLabel: {
    color: TEXT_PRIMARY,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
    textAlign: 'center'
  },
  versionCard: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 12
  },
  smallIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#005aad',
    borderWidth: 1,
    borderColor: 'rgba(33, 159, 255, 0.8)'
  },
  versionText: {
    flex: 1
  },
  versionTitle: {
    color: TEXT_PRIMARY,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800'
  },
  versionSubtitle: {
    color: '#aebbd0',
    fontSize: 15,
    lineHeight: 21
  }
})