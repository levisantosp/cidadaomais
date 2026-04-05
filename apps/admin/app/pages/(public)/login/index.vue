<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
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

definePageMeta({
  layout: 'public'
})

const schema = z.object({
  email: z.email('Informe um e-mail válido.'),
  password: z.string('Informe a senha.')
})
const typedSchema = toTypedSchema(schema)
const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: typedSchema
})

const [email] = defineField('email')
const [password] = defineField('password')

const showPassword = ref(false)
</script>

<template>
  <div class="flex pt-15 md:pt-20 justify-center">
    <Card class="w-full max-w-sm rounded-sm">
      <CardHeader>
        <CardTitle>Entre com a sua conta</CardTitle>
        <CardDescription>
          Informe seu e-mail e senha abaixo para entrar na sua conta
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form>
          <div class="grid w-full items-center gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
              <span v-if="errors.email" class="text-sm text-red-400">
                {{ errors.email }}
              </span>
            </div>

            <div class="flex flex-col space-y-1.5">
              <Label for="password">Senha</Label>

              <div class="relative">
                <Input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                />
                <span v-if="errors.password" class="text-sm text-red-400">
                  {{ errors.password }}
                </span>

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
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button class="w-full cursor-pointer">
          <span v-if="!isSubmitting">Entrar</span>
          <Spinner v-else />
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
