<script setup lang="ts">
  import { useMutation, useQuery } from '@tanstack/vue-query'
  import { toTypedSchema } from '@vee-validate/zod'
  import { refDebounced } from '@vueuse/core'
  import { Check, ChevronsUpDown } from 'lucide-vue-next'
  import { useForm } from 'vee-validate'
  import { toast } from 'vue-sonner'
  import { z } from 'zod'
  import Loading from '~/components/loading.vue'
  import { Button } from '~/components/ui/button'
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
  } from '~/components/ui/card'
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
  } from '~/components/ui/command'
  import { Input } from '~/components/ui/input'
  import { Label } from '~/components/ui/label'
  import {
    Popover,
    PopoverContent,
    PopoverTrigger
  } from '~/components/ui/popover'
  import { Textarea } from '~/components/ui/textarea'
  import { api } from '~/lib/api'

  definePageMeta({
    layout: 'private'
  })

  const schema = z.object({
    name: z
      .string('Informe um nome válido.')
      .min(2, 'O nome precisa ter no mínimo 2 caracteres.')
      .trim(),
    description: z
      .string('Informe uma descrição válida.')
      .min(10, 'A descrição precisa ter no mínimo 10 caracteres.')
      .trim(),
    phone: z
      .string('Número inválido. Tente números como 0800, 3515 ou com DDD.')
      .regex(
        /^(?:0800\d{7}|3515\d{4}|[1-9]{2}(?:9\d{8}|[2-5]\d{7}))$/,
        'Número inválido. Tente números como 0800, 3515 ou com DDD.'
      )
      .optional(),
    email: z.email('E-mail inválido.').optional(),
    website: z
      .url("Link inválido. O link deve começar com 'https://' ou 'http://'.")
      .optional(),
    unitsIds: z
      .array(z.coerce.bigint('Unidade inválida'), 'Informe as unidades')
      .min(1, 'Selecione ao menos uma unidade')
      .max(100, 'Selecione até 100 unidades')
  })
  const { defineField, errors, handleSubmit } = useForm({
    validationSchema: toTypedSchema(schema)
  })

  const [name, nameProps] = defineField('name')
  const [description, descriptionProps] = defineField('description')
  const [phone, phoneProps] = defineField('phone')
  const [email, emailProps] = defineField('email')
  const [website, websiteProps] = defineField('website')
  const [units, unitsProps] = defineField('unitsIds')

  const { mutate, isPending } = useMutation({
    mutationKey: ['entities', name],
    async mutationFn(data: z.infer<typeof schema>) {
      const response = await api.entities.post({
        ...data,
        unitsIds: data.unitsIds.map((id) =>
          id.toString()
        ) as unknown as bigint[]
      })
      if (response.error) {
        throw response.error.value
      }
    },
    onError(error) {
      toast.error('Ocorreu um erro inesperado...', {
        description: error.message
      })
      console.error(error)
    },
    async onSuccess() {
      toast.success('Órgão criado com sucesso!')
      await navigateTo('/orgaos')
    }
  })

  const search = ref<string>()
  const isComboboxOpen = ref(false)
  const trimmedSearch = computed(() => search.value?.trim())
  const debouncedSearch = refDebounced(trimmedSearch, 1000)

  const {
    isPending: isUnitsPending,
    isFetching,
    data
  } = useQuery({
    queryKey: ['units', debouncedSearch],
    enabled: computed(() => isComboboxOpen.value),
    staleTime: 60_000,
    async queryFn() {
      const response = await api.units.get({
        query: {
          page: 1,
          limit: 100,
          name: debouncedSearch.value
        }
      })
      if (response.error) {
        throw response.error.value
      }

      return response.data.data
    }
  })

  type Unit = NonNullable<typeof data.value>[number]

  const selectedUnits = computed(() => {
    return (
      data.value?.filter((item) => units.value?.includes(item.id.toString())) ??
      []
    )
  })

  const unitsLabel = computed(() => {
    if (!selectedUnits.value.length) {
      return 'Selecione as unidades'
    }

    return selectedUnits.value.map((item) => item.name).join(', ')
  })

  const handleSearch = (event: Event) => {
    search.value = (event.target as HTMLInputElement).value
  }

  const isUnitSelected = (item: Unit) => {
    return units.value?.includes(item.id.toString()) ?? false
  }

  const handleSelect = (item: Unit) => {
    const unitId = item.id.toString()

    if (isUnitSelected(item)) {
      units.value = units.value?.filter((id) => id !== unitId) ?? []
      return
    }

    units.value = [...(units.value ?? []), unitId]
  }

  const onSubmit = handleSubmit((data) => mutate(data))
</script>

<template>
  <div class="grid grid-cols-1 gap-6 space-y-6 p-6">
    <div>
      <h1 class="text-2xl font-bold">Novo Órgão</h1>
      <p class="text-muted-foreground text-sm">
        Adicione um novo órgão para disponibilizar no aplicativo
      </p>
    </div>

    <Card>
      <CardHeader> <CardTitle>Informações do órgão</CardTitle> </CardHeader>

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
              <Label for="description">Descrição</Label>
              <Textarea
                id="description"
                v-model="description"
                v-bind="descriptionProps"
                required
              />

              <span v-if="errors.description" class="text-sm text-red-400">
                {{ errors.description }}
              </span>
            </div>

            <div class="flex flex-col space-y-2">
              <Label for="phone">Telefone</Label>
              <Input id="phone" v-model="phone" v-bind="phoneProps" />

              <span v-if="errors.phone" class="text-sm text-red-400">
                {{ errors.phone }}
              </span>
            </div>

            <div class="flex flex-col space-y-2">
              <Label for="email">E-mail</Label>
              <Input id="email" v-model="email" v-bind="emailProps" />

              <span v-if="errors.email" class="text-sm text-red-400">
                {{ errors.email }}
              </span>
            </div>

            <div class="flex flex-col space-y-2">
              <Label for="website">Site</Label>
              <Input id="website" v-model="website" v-bind="websiteProps" />

              <span v-if="errors.website" class="text-sm text-red-400">
                {{ errors.website }}
              </span>
            </div>

            <div class="flex flex-col space-y-2">
              <Label for="units">Unidades</Label>

              <Popover v-model:open="isComboboxOpen">
                <PopoverTrigger as-child>
                  <Button
                    v-bind="unitsProps"
                    variant="outline"
                    :aria-expanded="isComboboxOpen"
                    class="w-full justify-between"
                  >
                    <span class="truncate">{{ unitsLabel }}</span>
                    <ChevronsUpDown class="size-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent class="w-(--reka-popover-trigger-width) p-0">
                  <Command>
                    <CommandInput
                      placeholder="Pesquisar unidade..."
                      @input="handleSearch"
                    />

                    <CommandList>
                      <CommandEmpty>
                        <Loading
                          v-if="isUnitsPending || isFetching"
                          class="pl-5"
                        />
                        <span v-else-if="!data?.length" class="pl-5"
                          >Nenhuma unidade encontrada</span
                        >
                      </CommandEmpty>

                      <CommandGroup>
                        <CommandItem
                          v-for="item in data"
                          :key="item.id.toString()"
                          :value="item.name"
                          @select="handleSelect(item)"
                        >
                          <Check v-if="isUnitSelected(item)" />
                          <span v-else class="size-4" />
                          {{ item.name }}
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <span v-if="errors.unitsIds" class="text-sm text-red-400">
                {{ errors.unitsIds }}
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