<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { BriefcaseBusiness, ChartBarStacked, Landmark } from "lucide-vue-next";
import { toast } from "vue-sonner";
import Loading from "~/components/loading.vue";
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
    const response = await Promise.all([
      api["services-count"].get(),
      api["entities-count"].get(),
      api["categories-count"].get()
    ]);

    const services = unwrapResponse(response[0]);
    const entities = unwrapResponse(response[1]);
    const categories = unwrapResponse(response[2]);

    return {
      servicesCount: services?.count,
      entitiesCount: entities?.count,
      categoriesCount: categories?.count
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
    label: "Serviços",
    icon: BriefcaseBusiness,
    color: "text-orange-400"
  },
  {
    key: "entitiesCount",
    label: "Órgãos",
    icon: Landmark,
    color: "text-blue-400"
  },
  {
    key: "categoriesCount",
    label: "Categorias",
    icon: ChartBarStacked,
    color: "text-rose-400"
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
          <Loading v-if="isPending || isFetching || !data" />
          <span v-else class="text-3xl font-bold">{{ data[item.key] }}</span>
        </div>
      </Card>
    </div>
  </div>
</template>
