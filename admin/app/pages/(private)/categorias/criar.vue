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
    .string("Informe um nome válido")
    .min(2, "O nome precisa ter no mínimo 2 caracteres")
    .trim()
});
const { defineField, errors, handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema)
});

const [name, nameAttr] = defineField("name");

const { mutate, isPending } = useMutation({
  mutationKey: ["categories", name],
  async mutationFn(data: z.infer<typeof schema>) {
    const response = await api.categories.post(data);
    if (response.error) {
      throw response.error.value;
    }
  },
  onError(error) {
    toast.error("Ocorreu um erro inesperado...", {
      description: error.message
    });
  },
  async onSuccess() {
    toast.success("Categoria criada com sucesso!");
    await navigateTo("/categorias");
  }
});

const onSubmit = handleSubmit((data) => mutate(data));
</script>

<template>
  <div class="grid grid-cols-1 gap-6 space-y-6 p-6">
    <div>
      <h1 class="text-2xl font-bold">Nova Categoria</h1>
      <p class="text-muted-foreground text-sm">
        Adicione uma nova categoria para disponibilizar no aplicativo
      </p>
    </div>

    <Card>
      <CardHeader> <CardTitle>Informações da categoria</CardTitle> </CardHeader>

      <CardContent>
        <form @submit.prevent="onSubmit">
          <div class="grid w-full items-center gap-4">
            <div class="flex flex-col space-y-2">
              <Label for="name">Nome</Label>
              <Input id="name" v-model="name" v-bind="nameAttr" />

              <span v-if="errors.name" class="text-sm text-red-400">
                {{ errors.name }}
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
          <Loading v-else :width="8" :height="8" />
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
