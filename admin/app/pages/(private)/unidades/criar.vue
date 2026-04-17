<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { toTypedSchema } from "@vee-validate/zod";
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
  latitude: z.number("Informe a latitude"),
  longitude: z.number("Informe a longitude")
});
const { defineField, errors, handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema)
});

const [name, nameProps] = defineField("name");
const [latitude, latitudeProps] = defineField("latitude");
const [longitude, longitudeProps] = defineField("longitude");

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
              <Label for="latitude">Latitude</Label>
              <Input
                id="latitude"
                v-model="latitude"
                v-bind="latitudeProps"
                type="number"
                step="any"
              />

              <span v-if="errors.latitude" class="text-sm text-red-400">
                {{ errors.latitude }}
              </span>
            </div>

            <div class="flex flex-col space-y-2">
              <Label for="longitude">Longitude</Label>
              <Input
                id="longitude"
                v-model="longitude"
                v-bind="longitudeProps"
                type="number"
                step="any"
              />

              <span v-if="errors.longitude" class="text-sm text-red-400">
                {{ errors.longitude }}
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
