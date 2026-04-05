<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
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
import { Spinner } from '~/components/ui/spinner'
import { auth } from '~/lib/auth'
import { error } from '~/config'
import type { User } from 'db'

definePageMeta({
  layout: 'public'
})

const schema = z.object({
  email: z.email('Informe um e-mail válido.').trim(),
  password: z.string('Informe a senha.').min(1, 'Informe a senha.').trim()
})
const typedSchema = toTypedSchema(schema)
const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: typedSchema
})

const onSubmit = handleSubmit(async (data) => {
  const response = await auth.signIn.email(data, {
    onError(ctx) {
      if (error[ctx.error.code]) {
        toast.error(error[ctx.error.code] ?? ctx.error.message)
      } else {
        toast.error('Ocorreu um erro inesperado...', {
          description: ctx.error.message
        })
      }
    }
  })
  if (response.error) return
  if ((response.data.user as unknown as User).role !== 'Administrator') {
    await auth.signOut()
    return toast.warning('Acesso restrito para administradores')
  }

  await navigateTo('/')
})

const [email, emailAttr] = defineField('email')
const [password, passwordAttr] = defineField('password')

const showPassword = ref(false)
</script>

<template>
  <div class="flex pt-15 md:pt-20 justify-center">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Entre com a sua conta</CardTitle>
        <CardDescription>
          Informe seu e-mail e senha abaixo para entrar na sua conta
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
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          class="w-full cursor-pointer"
          @click="onSubmit"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Entrar</span>
          <Spinner class="size-5" v-else />
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
