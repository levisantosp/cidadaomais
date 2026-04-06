<script setup lang="ts">
import { Toaster } from "~/components/ui/sonner";
import "vue-sonner/style.css";
import Loading from "~/components/loading.vue";
import { auth } from "~/lib/auth";

const session = auth.useSession();
</script>

<template>
  <div
    v-if="session.isPending"
    class="flex min-h-screen justify-center items-center"
  >
    <Loading />
  </div>
  <div v-else>
    <div>
      <NuxtLayout> <NuxtPage /> </NuxtLayout>
    </div>
    <Toaster position="top-center" theme="dark" />
  </div>
</template>
