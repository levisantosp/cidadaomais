<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import {
  BriefcaseBusiness,
  Building,
  ChartBarStacked,
  CircleX,
  Landmark
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import CardHeader from "~/components/ui/card/CardHeader.vue";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/lib/api";

definePageMeta({
  layout: "private"
});

const { isPending, isFetching, data, error } = useQuery({
  queryKey: ["home-data"],
  async queryFn() {
    const [
      servicesResponse,
      entitiesResponse,
      categoriesResponse,
      unitsResponse,
      logsResponse
    ] = await Promise.all([
      api["services-count"].get(),
      api["entities-count"].get(),
      api["categories-count"].get(),
      api["units-count"].get(),
      api["audit-log"].get({
        query: {
          page: 1,
          limit: 5
        }
      })
    ]);

    hasServicesError.value = !!servicesResponse.error;
    hasEntitiesError.value = !!entitiesResponse.error;
    hasCategoriesError.value = !!categoriesResponse.error;
    hasUnitsError.value = !!unitsResponse.error;
    hasLogsError.value = !!logsResponse.error;

    return {
      servicesCount: servicesResponse.error
        ? null
        : servicesResponse.data.count,
      entitiesCount: entitiesResponse.error
        ? null
        : entitiesResponse.data.count,
      categoriesCount: categoriesResponse.error
        ? null
        : categoriesResponse.data.count,
      unitsCount: unitsResponse.error ? null : unitsResponse.data.count,
      logs: logsResponse.error ? [] : logsResponse.data.data
    };
  }
});

const hasServicesError = ref(false);
const hasEntitiesError = ref(false);
const hasCategoriesError = ref(false);
const hasUnitsError = ref(false);
const hasLogsError = ref(true);
const hasGlobalError = ref(false);

watch(error, (e) => {
  if (!e) return;

  if (
    !hasServicesError.value &&
    !hasEntitiesError.value &&
    !hasCategoriesError.value &&
    !hasUnitsError.value &&
    !hasLogsError.value
  ) {
    hasGlobalError.value = true;
  }

  toast.error("Ocorreu um erro inesperado...", {
    description: e.message
  });
});

const statsErrors = computed(() => ({
  servicesCount: hasServicesError.value,
  entitiesCount: hasEntitiesError.value,
  categoriesCount: hasCategoriesError.value,
  unitsCount: hasUnitsError.value
}));

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
  },
  {
    key: "unitsCount",
    label: "Unidades",
    icon: Building,
    color: "text-green-400"
  }
] as const;
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="space-y-1">
      <h1 class="text-2xl font-bold">Painel de Controle</h1>
      <p class="text-sm text-muted-foreground">Visão geral do sistema</p>
    </div>

    <div class="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
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
          <div v-if="isPending || isFetching || !data">
            <Skeleton class="h-8 w-8" />
          </div>
          <div
            v-else-if="hasGlobalError"
            class="flex items-center gap-2 text-red-400 text-sm"
          >
            <CircleX class="size-4" />
            <span>Não foi possível buscar os dados no momento</span>
          </div>
          <div
            v-else-if="statsErrors[item.key]"
            class="flex items-center gap-2 text-red-400 text-sm"
          >
            <CircleX class="size-4" />
            <span>Não foi possível buscar os dados no momento</span>
          </div>
          <span v-else class="text-3xl font-bold">{{ data[item.key] }}</span>
        </div>
      </Card>
    </div>

    <div class="grid gap-4 md:grid-cols-2 grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle class="text-muted-foreground">
            Registros Recentes
          </CardTitle>
        </CardHeader>

        <CardContent class="space-y-4">
          <div
            v-if="isPending || isFetching || !data"
            class="flex flex-col gap-5"
          >
            <div v-for="n in 5" :key="n" class="flex gap-2">
              <Skeleton class="rounded-full h-10 w-10" />

              <div class="flex flex-col gap-1">
                <Skeleton class="h-5 w-xs" />
                <Skeleton class="h-3 w-48" />
              </div>
            </div>
          </div>
          <div
            v-else-if="hasGlobalError"
            class="flex items-center gap-2 text-red-400 text-sm"
          >
            <CircleX class="size-4" />
            <span>Não foi possível buscar os dados no momento</span>
          </div>
          <div
            v-else-if="hasLogsError"
            class="flex items-center gap-2 text-red-400 text-sm"
          >
            <CircleX class="size-4" />
            <span>Não foi possível buscar os dados no momento</span>
          </div>
          <div v-else-if="!data?.logs?.length">
            Nenhum registro até o momento.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-muted-foreground"> Ações Rápidas </CardTitle>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>
