<script setup lang="ts">
  import Loading from '~/components/loading.vue'
  import 'vue-sonner/style.css'
  import { Toaster } from '~/components/ui/sonner'
  import { auth } from '~/lib/auth'

  const session = auth.useSession()
</script>

<template>
  <div
    v-if="session.isPending"
    class="flex min-h-screen justify-center items-center"
  >
    <Loading :width="20" :height="20" />
  </div>
  <div v-else>
    <div>
      <NuxtLayout> <NuxtPage /> </NuxtLayout>
    </div>
    <Toaster position="top-center" theme="dark" />
  </div>
</template>