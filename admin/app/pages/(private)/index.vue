<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { BriefcaseBusiness, Landmark } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Card } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { unwrapResponse } from "~/config";
import { api } from "~/lib/api";

definePageMeta({
  layout: "private"
});

const { isPending, isFetching, data, error } = useQuery({
  queryKey: ["counts"],
  staleTime: 60_000,
  async queryFn() {
    const [servicesResponse, entitiesResponse] = await Promise.all([
      api["services-count"].get(),
      api["entities-count"].get()
    ]);

    const services = unwrapResponse(servicesResponse);
    const entities = unwrapResponse(entitiesResponse);

    return {
      servicesCount: services?.count,
      entitiesCount: entities?.count
    };
  }
});

watch(error, (e) => {
  if (!e) return;

  toast.error("Ocorreu um erro inesperado...", {
    description: e.message
  });
});

const statsConfig = [
  {
    key: "servicesCount",
    label: "Serviços Totais",
    icon: BriefcaseBusiness,
    color: "text-orange-400"
  },
  {
    key: "entitiesCount",
    label: "Órgãos Totais",
    icon: Landmark,
    color: "text-blue-400"
  }
] as const;
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="space-y-1">
      <h1 class="text-2xl font-bold">Painel de Controle</h1>
      <p class="text-sm text-muted-foreground">Visão geral do sistema</p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card
        v-for="item in statsConfig"
        :key="item.key"
        class="flex flex-col h-36 justify-between p-6"
      >
        <div class="flex justify-between items-center">
          <span class="text-lg font-semibold text-muted-foreground">
            {{ item.label }}
          </span>
          <component :is="item.icon" :class="['size-5', item.color]" />
        </div>

        <div>
          <Spinner v-if="isPending || isFetching || !data" class="size-6" />
          <span v-else class="text-3xl font-bold">{{ data[item.key] }}</span>
        </div>
      </Card>
    </div>
  </div>
</template>
