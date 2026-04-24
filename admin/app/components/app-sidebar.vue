<script setup lang="ts">
  import {
    BriefcaseBusiness,
    Building,
    ChartBarStacked,
    Home,
    Landmark,
    LogOut
  } from 'lucide-vue-next'
  import Loading from '~/components/loading.vue'
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
  } from '~/components/ui/sidebar'
  import { auth } from '~/lib/auth'

  const navItems = [
    {
      title: 'Página principal',
      href: '/',
      icon: Home
    },
    {
      title: 'Serviços',
      href: '/servicos',
      icon: BriefcaseBusiness
    },
    {
      title: 'Órgãos',
      href: '/orgaos',
      icon: Landmark
    },
    {
      title: 'Categorias',
      href: '/categorias',
      icon: ChartBarStacked
    },
    {
      title: 'Unidades',
      href: '/unidades',
      icon: Building
    }
  ] as const

  const isPending = ref(false)

  const handleSignout = async () => {
    isPending.value = true
    await auth.signOut()
    await navigateTo('/login')
  }
</script>

<template>
  <Sidebar>
    <SidebarHeader>
      <NuxtLink class="flex items-center" href="/">
        <NuxtImg src="/logo.png" :width="40" :height="40" />
        <h1 class="text-2xl text-center font-[1000]">
          <span class="text-[#0186ca]">CIDADÃO</span>
          <span class="text-[#3f9731]">MAIS</span>
        </h1>
      </NuxtLink>
      <h2 class="md:text-base text-center text-muted-foreground">
        Painel Administrativo
      </h2>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>

        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navItems" :key="item.href">
              <SidebarMenuButton as-child>
                <NuxtLink :href="item.href">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            class="bg-red-900 hover:bg-red-800 cursor-pointer"
            @click="handleSignout"
          >
            <span>Sair</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>

  <Teleport to="body">
    <div
      v-if="isPending"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <Loading :width="20" :height="20" class="text-white" />
    </div>
  </Teleport>
</template>