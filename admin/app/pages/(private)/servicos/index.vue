<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";

definePageMeta({
  layout: "private"
});
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h1 class="text-2xl font-bold">Gestão de Serviços</h1>
      <p class="text-muted-foreground text-sm">
        Veja e acompanhe os serviços cadastrados no sistema
      </p>
    </div>

    <Card>
      <CardHeader
        class="flex flex-col gap-4 pb-2 md:flex-row md:items-center md:justify-between"
      >
        <CardTitle class="text-2xl">Lista de Serviços</CardTitle>

        <NuxtLink href="/servicos/criar">
          <Button class="cursor-pointer">
            <Plus />
            Adicionar um novo serviço
          </Button>
        </NuxtLink>
      </CardHeader>
    </Card>
  </div>
</template>
