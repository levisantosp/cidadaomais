<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { toTypedSchema } from "@vee-validate/zod";
import { Map as Maplibre, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";
import Loading from "~/components/loading.vue";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/lib/api";

definePageMeta({
  layout: "private"
});

const schema = z.object({
  name: z
    .string("Informe o nome")
    .min(2, "O nome precisa ter no mínimo 2 caracteres")
    .trim(),
  latitude: z
    .number("Selecione a localização no mapa")
    .min(-90, "Latitude inválida")
    .max(90, "Latitude inválida"),
  longitude: z
    .number("Selecione a localização no mapa")
    .min(-180, "Longitude inválida")
    .max(180, "Longitude inválida")
});
const { defineField, errors, handleSubmit, setFieldValue } = useForm({
  validationSchema: toTypedSchema(schema)
});

const [name, nameProps] = defineField("name");

const { isPending, mutate } = useMutation({
  mutationKey: ["units"],
  async mutationFn(data: z.infer<typeof schema>) {
    const response = await api.units.post(data);
    if (response.error) {
      throw response.error.value;
    }
  },
  onError(error) {
    console.error(error);
    toast.error("Ocorreu um erro inesperado...", {
      description: error.message
    });
  },
  async onSuccess() {
    toast.success("Unidade criada com sucesso!");
    await navigateTo("/unidades");
  }
});

const onSubmit = handleSubmit((data) => mutate(data));

const mapContainer = ref<HTMLElement>();
const map = shallowRef<Maplibre>();
const marker = shallowRef<Marker>();

const updateLocation = (long: number, lat: number) => {
  setFieldValue("latitude", lat);
  setFieldValue("longitude", long);

  if (!map.value) {
    return;
  }

  if (!marker.value) {
    marker.value = new Marker({
      draggable: true
    })
      .setLngLat([long, lat])
      .addTo(map.value);

    marker.value.on("dragend", () => {
      const position = marker.value?.getLngLat();

      if (!position) {
        return;
      }

      updateLocation(position.lng, position.lat);
    });

    return;
  }

  marker.value.setLngLat([long, lat]);
};

onMounted(() => {
  map.value = new Maplibre({
    container: mapContainer.value ?? "",
    style: "https://tiles.openfreemap.org/styles/liberty",
    center: [-52.206, -3.203],
    zoom: 12
  });

  map.value.on("click", (event) =>
    updateLocation(event.lngLat.lng, event.lngLat.lat)
  );

  marker.value?.on("dragend", () => {
    const position = marker.value?.getLngLat();
    if (!position) return;
    updateLocation(position.lng, position.lat);
  });
});

onBeforeUnmount(() => {
  marker.value?.remove();
  map.value?.remove();
});
</script>

<template>
  <div class="grid grid-cols-1 gap-6 space-y-6 p-6">
    <div>
      <h1 class="text-2xl font-bold">Nova Unidade</h1>
      <p class="text-muted-foreground text-sm">
        Adicione uma nova unidade para disponibilizar no aplicativo
      </p>
    </div>

    <Card>
      <CardHeader> <CardTitle>Informações da unidade</CardTitle> </CardHeader>

      <CardContent>
        <form @submit.prevent="onSubmit">
          <div class="grid w-full items-center gap-4">
            <div class="flex flex-col space-y-2">
              <Label for="name">Nome</Label>
              <Input id="name" v-model="name" v-bind="nameProps" />

              <span v-if="errors.name" class="text-sm text-red-400">
                {{ errors.name }}
              </span>
            </div>

            <div class="flex flex-col space-y-2">
              <Label>Localização</Label>

              <div
                ref="mapContainer"
                class="h-128 overflow-hidden rounded-md border"
              />

              <span
                v-if="errors.latitude || errors.longitude"
                class="text-sm text-red-400"
              >
                {{ errors.latitude || errors.longitude }}
              </span>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <Button
          class="w-full cursor-pointer"
          @click="onSubmit"
          :disabled="isPending === true"
        >
          <span v-if="!isPending">Criar</span>
          <Loading v-else />
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
