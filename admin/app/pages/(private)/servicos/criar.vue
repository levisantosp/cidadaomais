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
  const typedSchema = toTypedSchema(schema)
  const { defineField, errors, handleSubmit } = useForm({
    validationSchema: typedSchema
  })

  const [name, nameAttr] = defineField('name')
  const [desc, descAttr] = defineField('description')
  const [requirements, requirementsAttr] = defineField('requirements')
  const [guidelines, guidelinesAttr] = defineField('guidelines')
  const [categoryId, categoryIdAttr] = defineField('categoryId')

  const isComboboxOpen = ref(false)
  const search = ref<string>()
  const selectedCategory = ref<{
    name: string
    id: string
  }>()
  const trimmedSearch = computed(() => search.value?.trim())
  const debouncedSearch = refDebounced(trimmedSearch, 1000)

  const {
    isPending: isCategoryPending,
    isFetching,
    error: categoryError,
    data
  } = useQuery({
    queryKey: ['categories', debouncedSearch],
    enabled: computed(() => isComboboxOpen.value),
    staleTime: 60_000,
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

  const handleSearch = (event: Event) => {
    search.value = (event.target as HTMLInputElement).value
  }

  const handleSelect = (value: { name: string; id: string }) => {
    selectedCategory.value = value
    categoryId.value = value.id
  }

  const { isPending, mutate } = useMutation({
    mutationKey: ['services'],
    async mutationFn(data: z.infer<typeof schema>) {
      const response = await api.services.post({
        ...data,
        categoryId: data.categoryId as unknown as bigint
      })
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
      toast.success('Serviço criado com sucesso!')
    }
  })

  const onSubmit = handleSubmit((data) => mutate(data))
</script>

<template>
  <div class="grid grid-cols-1 gap-6 space-y-6 p-6">
    <div>
      <h1 class="text-2xl font-bold">Novo Serviço</h1>
      <p class="text-muted-foreground text-sm">
        Adicione um novo serviço para disponibilizar no aplicativo
      </p>
    </div>

    <Card>
      <CardHeader
        class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <CardTitle class="text-xl">Informações do serviço</CardTitle>
      </CardHeader>

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
                          v-if="isCategoryPending || isFetching"
                          class="pl-5"
                        />
                        <span v-else-if="!data?.length" class="pl-5"
                          >Nenhuma categoria encontrada</span
                        >
                      </CommandEmpty>

                      <CommandGroup>
                        <CommandItem
                          v-for="item in data"
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
      </CardContent>

      <CardFooter>
        <Button
          class="w-full cursor-pointer"
          @click="onSubmit"
          :disabled="isPending"
        >
          <div v-if="!isPending"><span>Criar</span></div>
          <Loading v-else :width="8" :height="8" />
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
