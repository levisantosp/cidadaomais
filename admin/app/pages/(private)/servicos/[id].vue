<script setup lang="ts">
  import { useMutation, useQuery } from '@tanstack/vue-query'
  import { toTypedSchema } from '@vee-validate/zod'
  import { refDebounced } from '@vueuse/core'
  import { ChevronsUpDown, Edit, Trash, Undo2 } from 'lucide-vue-next'
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
  import {
    TagsInput,
    TagsInputInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText
  } from '~/components/ui/tags-input'
  import { Textarea } from '~/components/ui/textarea'
  import { api } from '~/lib/api'

  definePageMeta({
    layout: 'private'
  })

  const route = useRoute()
  const router = useRouter()

  const { isPending, isFetching, error, data, refetch } = useQuery({
    queryKey: ['service', route.params.id],
    async queryFn() {
      if (!route.params.id) {
        throw new Error()
      }

      const response = await api
        .services({
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
      router.push('/servicos')
    }
  })

  const editValues = ref<{
    name: string
    description: string
    requirements: string[]
    guidelines: string
    categoryId: bigint
  }>()
  const isDialogOpen = ref(false)

  const handleDialogOpen = (open: boolean) => {
    isDialogOpen.value = open

    if (!open || !data.value) {
      editValues.value = undefined
      selectedCategory.value = undefined
      return
    }

    editValues.value = data.value
    selectedCategory.value = {
      ...data.value.category,
      id: data.value.categoryId.toString()
    }

    resetForm({
      values: {
        ...data.value,
        categoryId: data.value.categoryId.toString()
      }
    })
  }

  const schema = z.object({
    name: z
      .string('Informe um nome válido')
      .min(2, 'O nome precisa ter no mínimo 2 caracteres')
      .trim(),
    description: z
      .string('Informe uma descrição válida')
      .min(10, 'A descrição precisa ter no mínimo 10 caracteres')
      .trim(),
    requirements: z
      .string('Informe requisitos válidos')
      .trim()
      .array()
      .min(1, 'Precisa ter no mínimo 1 requisito'),
    guidelines: z
      .string('Informe um guia válido')
      .min(10, 'O guia precisa ter no mínimo 10 caracteres')
      .trim(),
    categoryId: z.string('Informe a categoria')
  })
  const { defineField, errors, handleSubmit, resetForm } = useForm({
    validationSchema: toTypedSchema(schema)
  })

  const [name, nameAttr] = defineField('name')
  const [desc, descAttr] = defineField('description')
  const [requirements, requirementsAttr] = defineField('requirements')
  const [guidelines, guidelinesAttr] = defineField('guidelines')
  const [categoryId] = defineField('categoryId')

  const isComboboxOpen = ref(false)
  const search = ref<string>()
  const selectedCategory = ref<{
    name: string
    id: string
  }>()
  const trimmedSearch = computed(() => search.value?.trim())
  const debouncedSearch = refDebounced(trimmedSearch, 1000)

  const handleSearch = (event: Event) => {
    search.value = (event.target as HTMLInputElement).value
  }

  const handleSelect = (value: { name: string; id: string }) => {
    selectedCategory.value = value
    categoryId.value = value.id
  }

  const { isPending: isMutationPending, mutate } = useMutation({
    async mutationFn(formData: z.infer<typeof schema>) {
      if (!data.value || !editValues.value) {
        throw new Error()
      }

      const response = await api
        .services({
          id: data.value.id.toString()
        })
        .put({
          ...formData,
          categoryId: formData.categoryId as unknown as bigint
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
      await refetch()
    }
  })

  const {
    isPending: isCategoriesPending,
    isFetching: isCategoriesFetching,
    data: categories
  } = useQuery({
    queryKey: ['categories', debouncedSearch],
    enabled: computed(() => isComboboxOpen.value),
    async queryFn() {
      const response = await api.categories.get({
        query: {
          limit: 100,
          page: 1,
          name: debouncedSearch.value
        }
      })
      if (response.error) {
        throw response.error.value
      }

      return response.data.data
    }
  })

  const { isPending: isDeletePending, mutate: handleDelete } = useMutation({
    async mutationFn() {
      if (!route.params.id) {
        throw new Error()
      }

      const response = await api
        .services({
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
      toast.success('Serviço deletado com sucesso!')
      router.push('/servicos')
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
          @click="router.push('/servicos')"
        >
          <Undo2 />
        </Button>

        <div>
          <h1 class="md:text-3xl text-2xl font-bold">Detalhes do Serviço</h1>
          <p class="text-muted-foreground text-sm md:text-lg">
            Visualize e gerencie as informações deste serviço
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

              <CardTitle>Requisitos</CardTitle>
              <CardDescription class="flex gap-2">
                <div v-for="item in data.requirements">
                  <span class="border rounded-xs px-2 py-0.5">{{ item }}</span>
                </div>
              </CardDescription>

              <CardTitle>Guia</CardTitle>
              <CardDescription>{{ data.guidelines }}</CardDescription>

              <CardTitle>Categoria</CardTitle>
              <CardDescription>{{ data.category.name }}</CardDescription>
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
        <DialogDescription
          >Edite as informações desta categoria</DialogDescription
        >
      </DialogHeader>

      <form @submit.prevent="onSubmit">
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-2">
            <Label for="name">Nome</Label>
            <Input id="name" v-model="name" v-bind="nameAttr" />

            <span v-if="errors.name" class="text-sm text-red-400">
              {{ errors.name }}
            </span>
          </div>

          <div class="flex flex-col space-y-2">
            <Label for="description">Descrição</Label>
            <Textarea id="description" v-model="desc" v-bind="descAttr" />

            <span v-if="errors.description" class="text-sm text-red-400">
              {{ errors.description }}
            </span>
          </div>

          <div class="flex flex-col space-y-2">
            <Label for="requirements">Requisitos</Label>
            <TagsInput
              id="requirements"
              v-model="requirements"
              v-bind="requirementsAttr"
            >
              <TagsInputItem
                v-for="item in requirements"
                :key="item"
                :value="item"
              >
                <TagsInputItemText />
                <TagsInputItemDelete />
              </TagsInputItem>

              <TagsInputInput
                placeholder="Digite o requisito e pressione Enter para adicionar"
              />
            </TagsInput>

            <span v-if="errors.requirements" class="text-sm text-red-400">
              {{ errors.requirements }}
            </span>
          </div>

          <div class="flex flex-col space-y-2">
            <Label for="guidelines">Guia</Label>
            <Textarea
              id="guidelines"
              v-model="guidelines"
              v-bind="guidelinesAttr"
            />

            <span v-if="errors.guidelines" class="text-sm text-red-400">
              {{ errors.guidelines }}
            </span>
          </div>

          <div class="flex flex-col space-y-2">
            <Label for="categoryId">Categoria</Label>

            <Popover v-model:open="isComboboxOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :aria-expanded="isComboboxOpen"
                  class="w-full justify-between"
                >
                  <span>
                    {{ selectedCategory?.name || 'Selecione uma categoria' }}
                  </span>
                  <ChevronsUpDown class="size-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent class="w-(--reka-popover-trigger-width) p-0">
                <Command>
                  <CommandInput
                    placeholder="Pesquisar categoria..."
                    @input="handleSearch"
                  />

                  <CommandList>
                    <CommandEmpty>
                      <Loading
                        v-if="isCategoriesPending || isCategoriesFetching"
                        class="pl-5"
                      />
                      <span v-else class="pl-5"
                        >Nenhuma categoria encontrada</span
                      >
                    </CommandEmpty>

                    <CommandGroup>
                      <CommandItem
                        v-for="item in categories"
                        :key="item.id.toString()"
                        :value="item.name"
                        @select="
                          handleSelect({
                            ...item,
                            id: item.id.toString()
                          })
                        "
                      >
                        <Check />
                        {{ item.name }}
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <span v-if="errors.categoryId" class="text-sm text-red-400">
              {{ errors.categoryId }}
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