<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { refDebounced } from '@vueuse/core'
import { Check, ChevronsUpDown, Edit, Trash, Undo2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import Loading from '~/components/loading.vue'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
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

const router = useRouter()
const route = useRoute()

const { isPending, isFetching, error, data, refetch } = useQuery({
  queryKey: ['entities', route.params.id],
  async queryFn() {
    if (!route.params.id) {
      throw new Error()
    }
    const response = await api
      .entities({
        id: route.params.id.toString()
      })
      .get()
    if (response.error) {
      throw response.error.value
    }

    return response.data
  }
})

watch(error, (e) => {
  if (e) {
    toast.error('Ocorreu um erro inesperado...', {
      description: e.message
    })
    router.push('/orgaos')
  }
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
const { defineField, errors, handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(schema)
})

const [name, nameProps] = defineField('name')
const [description, descriptionProps] = defineField('description')
const [phone, phoneProps] = defineField('phone')
const [email, emailProps] = defineField('email')
const [website, websiteProps] = defineField('website')
const [units, unitsProps] = defineField('unitsIds')

const editValues = ref<{
  name: string
  description: string
  phone?: string
  email?: string
  website?: string
  unitsIds: string[]
}>()
const isDialogOpen = ref(false)
const search = ref<string>()
const isComboboxOpen = ref(false)
const selectedUnits = ref<
  {
    name: string
    id: string
  }[]
>([])
const hasSyncedUnits = ref(false)
const trimmedSearch = computed(() => search.value?.trim())
const debouncedSearch = refDebounced(trimmedSearch, 1000)

const {
  isPending: isUnitsPending,
  isFetching: isUnitsFetching,
  data: unitsData,
  refetch: refetchUnits
} = useQuery({
  queryKey: ['units', debouncedSearch],
  enabled: computed(() => !!data.value),
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

type Unit = NonNullable<typeof unitsData.value>[number]
type EntityWithUnits = NonNullable<typeof data.value> & {
  units?: {
    name: string
    id: bigint
  }[]
  unitsIds?: (bigint | string)[]
}

const entityUnits = computed(() => {
  if (!data.value) {
    return []
  }

  const entity = data.value as EntityWithUnits
  const entityUnits = entity.units?.map((item) => ({
    name: item.name,
    id: item.id.toString()
  }))
  if (entityUnits?.length) {
    return entityUnits
  }

  const unitsIds = entity.unitsIds?.map((id) => id.toString()) ?? []
  const unitsByIds =
    unitsData.value
      ?.filter((item) => unitsIds.includes(item.id.toString()))
      .map((item) => ({
        name: item.name,
        id: item.id.toString()
      })) ?? []
  if (unitsByIds.length) {
    return unitsByIds
  }

  return (
    unitsData.value
      ?.filter(
        (item) => item.entityId?.toString() === data.value?.id.toString()
      )
      .map((item) => ({
        name: item.name,
        id: item.id.toString()
      })) ?? []
  )
})

const unitsLabel = computed(() => {
  if (!selectedUnits.value.length) {
    return 'Selecione as unidades'
  }

  return selectedUnits.value.map((item) => item.name).join(', ')
})

const syncEntityUnits = () => {
  if (hasSyncedUnits.value) {
    return
  }

  if (!entityUnits.value.length) {
    return
  }

  selectedUnits.value = entityUnits.value
  units.value = entityUnits.value.map((item) => item.id)
  hasSyncedUnits.value = true
}

const handleDialogOpen = (open: boolean) => {
  isDialogOpen.value = open

  if (!open || !data.value) {
    editValues.value = undefined
    selectedUnits.value = []
    hasSyncedUnits.value = false
    search.value = undefined
    return
  }

  const values = {
    name: data.value.name,
    description: data.value.description,
    phone: data.value.phone ?? undefined,
    email: data.value.email ?? undefined,
    website: data.value.website ?? undefined,
    unitsIds: entityUnits.value.map((item) => item.id)
  }

  editValues.value = values
  selectedUnits.value = entityUnits.value
  hasSyncedUnits.value = !!entityUnits.value.length

  resetForm({
    values
  })
}

watch(unitsData, () => {
  if (!isDialogOpen.value) {
    return
  }

  syncEntityUnits()
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
    selectedUnits.value = selectedUnits.value.filter(
      (item) => item.id !== unitId
    )
    return
  }

  units.value = [...(units.value ?? []), unitId]
  selectedUnits.value = [
    ...selectedUnits.value,
    {
      name: item.name,
      id: unitId
    }
  ]
}

const { isPending: isMutationPending, mutate } = useMutation({
  async mutationFn(formData: z.infer<typeof schema>) {
    if (!data.value || !editValues.value) {
      throw new Error()
    }

    const response = await api
      .entities({
        id: data.value.id.toString()
      })
      .put({
        ...formData,
        unitsIds: formData.unitsIds.map((id) =>
          id.toString()
        ) as unknown as bigint[]
      })
    if (response.error) {
      throw response.error.value
    }

    editValues.value = undefined
    isDialogOpen.value = false
  },
  onError(e) {
    toast.error('Ocorreu um erro inesperado...', {
      description: e.message
    })
    console.error(e)
  },
  async onSuccess() {
    toast.success('Órgão atualizado com sucesso!')
    await refetch()
    await refetchUnits()
  }
})

const { isPending: isDeletePending, mutate: handleDelete } = useMutation({
  async mutationFn() {
    if (!route.params.id) {
      throw new Error()
    }

    const response = await api
      .entities({
        id: route.params.id.toString()
      })
      .delete()
    if (response.error) {
      throw response.error.value
    }
  },
  onError(error) {
    console.error(error)
    toast.error('Ocorreu um erro inesperado...', {
      description: error.message
    })
  },
  onSuccess() {
    toast.success('Órgão deletado com sucesso!')
    router.push('/orgaos')
  }
})

const onSubmit = handleSubmit((data) => mutate(data))
</script>

<template>
  <div v-if="isPending || isFetching || !data" class="flex justify-center pt-5">
    <Loading />
  </div>

  <div v-else class="pt-10">
    <div class="flex items-center justify-between pl-5 pr-5">
      <div class="flex items-center gap-4">
        <Button
          variant="outline"
          class="cursor-pointer"
          @click="router.push('/orgaos')"
        >
          <Undo2 />
        </Button>

        <div>
          <h1 class="md:text-3xl text-2xl font-bold">Detalhes do Órgão</h1>
          <p class="text-muted-foreground text-sm md:text-lg">
            Visualize e gerencie as informações deste órgão
          </p>
        </div>
      </div>

      <div class="flex gap-2">
        <Button
          variant="destructive"
          class="cursor-pointer"
          @click="handleDelete()"
          :disabled="isDeletePending"
        >
          <Loading v-if="isDeletePending" class="w-16" />
          <Trash v-if="!isDeletePending" />
          <span v-if="!isDeletePending">Deletar</span>
        </Button>

        <Button class="cursor-pointer" @click="handleDialogOpen(true)">
          <Edit />
          Editar
        </Button>
      </div>
    </div>

    <div class="pt-5 pl-5 pr-5 grid md:grid-cols-1 grid-cols-1">
      <Card class="w-full max-w-xs md:max-w-full">
        <CardHeader>
          <CardTitle class="text-xl">{{ data.name }}</CardTitle>
        </CardHeader>

        <CardContent>
          <Card class="bg-background/30 w-full max-w-xs md:max-w-full">
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
              <CardDescription>{{ data.description }}</CardDescription>

              <CardTitle>Telefone</CardTitle>
              <CardDescription>{{ data.phone ?? '-' }}</CardDescription>

              <CardTitle>E-mail</CardTitle>
              <CardDescription>{{ data.email ?? '-' }}</CardDescription>

              <CardTitle>Site</CardTitle>
              <CardDescription>{{ data.website ?? '-' }}</CardDescription>

              <CardTitle>Unidades</CardTitle>
              <CardDescription class="flex flex-wrap gap-2">
                <span v-if="!entityUnits.length">-</span>

                <div v-for="item in entityUnits" :key="item.id">
                  <span class="border rounded-xs px-2 py-0.5">
                    {{ item.name }}
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        </CardContent>
      </Card>
    </div>
  </div>

  <Dialog
    v-if="data && editValues"
    :open="true"
    @update:open="handleDialogOpen"
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar {{ data.name }}</DialogTitle>
        <DialogDescription>Edite as informações deste órgão</DialogDescription>
      </DialogHeader>

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
                        v-if="isUnitsPending || isUnitsFetching"
                        class="pl-5"
                      />
                      <span v-else-if="!unitsData?.length" class="pl-5">
                        Nenhuma unidade encontrada
                      </span>
                    </CommandEmpty>

                    <CommandGroup>
                      <CommandItem
                        v-for="item in unitsData"
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

      <DialogFooter>
        <DialogClose>
          <Button variant="outline" class="cursor-pointer">Cancelar</Button>
        </DialogClose>

        <Button
          @click="onSubmit"
          class="cursor-pointer"
          :disabled="isMutationPending"
        >
          <Loading v-if="isMutationPending" class="w-10.5" />
          <span v-else>Salvar</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>