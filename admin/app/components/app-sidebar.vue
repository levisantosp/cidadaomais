<script setup lang="ts">
import { BriefcaseBusiness, Home } from "lucide-vue-next";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/components/ui/sidebar";

const navItems = [
  {
    title: "Página principal",
    href: "/",
    icon: Home
  },
  {
    title: "Serviços",
    href: "/servicos",
    icon: BriefcaseBusiness
  }
] as const;
</script>

<template>
  <Sidebar>
    <SidebarHeader>
      <h1 class="text-2xl text-center font-[1000]">
        <span class="text-[#0186ca]">CIDADÃO</span>
        <span class="text-[#3f9731]">MAIS</span>
      </h1>
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
  </Sidebar>
</template>
