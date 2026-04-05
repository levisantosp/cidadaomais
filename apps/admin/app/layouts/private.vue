<script setup lang="ts">
import AppSidebar from '~/components/app-sidebar.vue'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '~/components/ui/sidebar'
</script>

<template>
  <div>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header class="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>

        <main><slot /></main>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>
