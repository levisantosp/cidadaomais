<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import type { User } from 'db'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import Loading from '~/components/loading.vue'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { error } from '~/config'
import { auth } from '~/lib/auth'

definePageMeta({
  layout: 'public'
})

const schema = z
  .object({
    email: z.email('Informe um e-mail válido.').trim(),
    password: z
      .string('Informe a senha.')
      .min(6, 'A senha precisa ter no mínimo 6 caracteres')
      .trim(),
    confirmPassword: z
      .string('Informe a senha.')
      .min(6, 'A senha precisa ter no mínimo 6 caracteres')
      .trim(),
    name: z
      .string('Informe seu nome')
      .min(3, 'O nome precisa ter no mínimo 3 caracteres')
      .trim()
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'As senhas não coincidem',
    path: ['confirmPassword']
  })

const typedSchema = toTypedSchema(schema)
const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: typedSchema
})

const onSubmit = handleSubmit(async (data) => {
  const response = await auth.signUp.email(
    {
      email: data.email,
      password: data.password,
      name: data.name
    },
    {
      onError(ctx) {
        if (error[ctx.error.code]) {
          toast.error(error[ctx.error.code] ?? ctx.error.message)
        } else {
          toast.error('Ocorreu um erro inesperado...', {
            description: ctx.error.message
          })
        }
      }
    }
  )
  if (response.error) return
  if ((response.data.user as unknown as User).role !== 'Administrator') {
    await auth.signOut()
    return toast.warning('Acesso restrito para administradores')
  }
})

const [email, emailAttr] = defineField('email')
const [password, passwordAttr] = defineField('password')
const [confirmPassword, confirmPasswordAttr] = defineField('confirmPassword')
const [name, nameAttr] = defineField('name')

const showPassword = ref(false)
</script>

<template>
  <div class="flex pt-15 md:pt-20 justify-center">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Crie uma conta</CardTitle>
        <CardDescription>
          Informe os dados necessários para criar sua conta
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="onSubmit">
          <div class="grid w-full items-center gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                v-model="email"
                v-bind="emailAttr"
                placeholder="seu@email.com"
              />

              <span v-if="errors.email" class="text-sm text-red-400">
                {{ errors.email }}
              </span>
            </div>

            <div class="flex flex-col space-y-1.5">
              <Label for="email">Nome</Label>
              <Input
                id="name"
                type="text"
                v-model="name"
                v-bind="nameAttr"
                autocomplete="off"
              />

              <span v-if="errors.name" class="text-sm text-red-400">
                {{ errors.name }}
              </span>
            </div>

            <div class="flex flex-col space-y-1.5">
              <Label for="password">Senha</Label>

              <div class="relative">
                <Input
                  id="password"
                  v-model="password"
                  v-bind="passwordAttr"
                  :type="showPassword ? 'text' : 'password'"
                  class="pr-10"
                />

                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex w-10 items-center justify-center"
                  @click="showPassword = !showPassword"
                >
                  <Eye
                    v-if="!showPassword"
                    class="text-muted-foreground"
                    :size="20"
                  />
                  <EyeOff v-else class="text-muted-foreground" :size="20" />
                </button>
              </div>

              <span v-if="errors.password" class="text-sm text-red-400">
                {{ errors.password }}
              </span>
            </div>

            <div class="flex flex-col space-y-1.5">
              <Label for="password">Confirmar senha</Label>

              <div class="relative">
                <Input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  v-bind="confirmPasswordAttr"
                  :type="showPassword ? 'text' : 'password'"
                  class="pr-10"
                />

                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex w-10 items-center justify-center"
                  @click="showPassword = !showPassword"
                >
                  <Eye
                    v-if="!showPassword"
                    class="text-muted-foreground"
                    :size="20"
                  />
                  <EyeOff v-else class="text-muted-foreground" :size="20" />
                </button>
              </div>

              <span v-if="errors.confirmPassword" class="text-sm text-red-400">
                {{ errors.confirmPassword }}
              </span>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          class="w-full cursor-pointer"
          @click="onSubmit"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Criar conta</span>
          <Loading v-else />
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>