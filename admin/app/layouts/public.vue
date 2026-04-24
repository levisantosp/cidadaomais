<script setup lang="ts">
  import { Button } from '~/components/ui/button'
</script>

<template>
  <div>
    <header
      class="flex justify-between px-4 py-5 sm:px-6 md:px-10 lg:px-16 xl:px-20"
    >
      <div class="flex items-center cursor-pointer">
        <NuxtImg src="/logo.png" :width="80" :height="80" />
        <h1 class="text-2xl font-[1000] md:text-4xl">
          <span class="text-[#0186ca]">CIDADÃO</span>
          <span class="text-[#3f9731]">MAIS</span>
        </h1>
      </div>

      <div class="flex gap-2">
        <NuxtLink to="/login">
          <Button class="cursor-pointer rounded-sm">Entrar</Button>
        </NuxtLink>
        <NuxtLink to="/registrar">
          <Button class="cursor-pointer rounded-sm" variant="secondary">
            Criar conta
          </Button>
        </NuxtLink>
      </div>
    </header>
    <main><slot /></main>
  </div>
</template>