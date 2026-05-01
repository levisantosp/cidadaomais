<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import dayjs from 'dayjs'
import type { Category } from 'db'
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Plus, Trash } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import Loading from '~/components/loading.vue'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { api } from '~/lib/api'

definePageMeta({
  layout: 'private'
})

const page = ref(1)
const isDialogMenuOpen = ref(false)
const selectedCategory = ref<Category>()
const editValues = ref({
  name: ''
})

const { isPending, isFetching, data, refetch } = useQuery({
  queryKey: ['categories'],
  async queryFn() {
    const response = await api.categories.get({
      query: {
        limit: 10,
        page: page.value
      }
    })
    if (response.error) {
      throw response.error.value
    }

    return response.data
  }
})

const { mutate, isPending: isDeletePending } = useMutation({
  async mutationFn() {
    if (!selectedCategory.value) {
      return toast.warning('Não foi possível deletar essa categoria no momento')
    }

    await api
      .categories({
        id: selectedCategory.value.id.toString()
      })
      .delete()

    selectedCategory.value = undefined

    await refetch()
  },
  onError(error) {
    toast.error('Ocorreu um erro inesperado...', {
      description: error.message
    })
    console.error(error)
  }
})

const { mutate: mutateEdit, isPending: isEditPending } = useMutation({
  async mutationFn() {
    if (!selectedCategory.value || !editValues.value) {
      return toast.warning('Não foi possível editar essa categoria no momento')
    }

    await api
      .categories({
        id: selectedCategory.value.id.toString()
      })
      .put(editValues.value)

    isDialogMenuOpen.value = false
    selectedCategory.value = undefined

    await refetch()
  },
  onError(error) {
    toast.error('Ocorreu um erro inesperado...', {
      description: error.message
    })
    console.error(error)
  }
})

const handlePage = async (action: 'previous' | 'next') => {
  if (action === 'previous') {
    page.value = Math.max(1, page.value - 1)
  } else {
    page.value += 1
  }

  await refetch()
}
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h1 class="text-2xl font-bold">Gestão de Categorias</h1>
      <p class="text-muted-foreground text-sm">Veja e acompanhe as categorias cadastradas no sistema</p>
    </div>

    <Card>
      <CardHeader class="flex flex-col gap-4 pb-2 md:flex-row md:items-center md:justify-between">
        <CardTitle class="text-2xl">Lista de Categorias</CardTitle>

        <NuxtLink href="/categorias/criar">
          <Button class="cursor-pointer">
            <Plus />
            Adicionar uma nova categoria
          </Button>
        </NuxtLink>
      </CardHeader>

      <CardContent>
        <div v-if="isPending || isFetching || !data" class="flex justify-center">
          <Loading />
        </div>

        <div v-else>
          <div class="flex items-center justify-center space-x-2 py-2">
            <Button variant="outline" class="cursor-pointer" :disabled="data.page <= 1" @click="handlePage('previous')">
              <ChevronLeft />
            </Button>
            <div>Página {{ data.page }}</div>
            <Button variant="outline" class="cursor-pointer" :disabled="!data.hasNextPage" @click="handlePage('next')">
              <ChevronRight />
            </Button>
          </div>

          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead>Atualizada em</TableHead>
                  <TableHead class="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow v-if="!data.data.length" :colSpan="6" class="text-muted-foreground text-center h-25">
                  <TableCell>Nenhuma categoria encontrada</TableCell>
                </TableRow>

                <TableRow v-else v-for="category in data.data" class="text-muted-foreground cursor-pointer">
                  <TableCell>{{ category.name }}</TableCell>
                  <TableCell>{{ dayjs(category.createdAt).format('DD/MM/YYYY HH:mm:ss') }}</TableCell>
                  <TableCell>{{ dayjs(category.updatedAt).format('DD/MM/YYYY HH:mm:ss') }}</TableCell>

                  <TableCell class="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" class="w-6 h-6 cursor-pointer">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>

                        <DropdownMenuItem
                          class="cursor-pointer"
                          @click="
                            () => {
                              selectedCategory = category
                              isDialogMenuOpen = true
                              editValues.name = category.name
                            }
                          "
                        >
                          <Pencil />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          class="cursor-pointer"
                          @click="selectedCategory = category"
                        >
                          <Trash />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div class="flex items-center justify-center space-x-2 py-2">
            <Button variant="outline" class="cursor-pointer" :disabled="data.page <= 1" @click="handlePage('previous')">
              <ChevronLeft />
            </Button>
            <div>Página {{ data.page }}</div>
            <Button variant="outline" class="cursor-pointer" :disabled="!data.hasNextPage" @click="handlePage('next')">
              <ChevronRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <Dialog
    :open="isDialogMenuOpen"
    @update:open="
      (open) => {
        isDialogMenuOpen = open
        if (!open) {
          selectedCategory = undefined
          editValues.name = ''
        }
      }
    "
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar categoria</DialogTitle>
        <DialogDescription>Edite as informações da categoria</DialogDescription>
      </DialogHeader>

      <div class="flex items-center gap-2">
        <div class="grid flex-1 gap-2">
          <Label for="name">Nome</Label>
          <Input id="link" :defaultValue="editValues.name" v-model="editValues.name" />
        </div>
      </div>

      <DialogFooter>
        <DialogClose>
          <Button variant="outline" class="cursor-pointer"> Cancelar </Button>
        </DialogClose>

        <Button class="cursor-pointer" @click="mutateEdit()" :disabled="isEditPending">
          <Loading v-if="isEditPending" class="w-12" />
          <span v-else>Salvar alterações</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <Dialog
    :open="!!selectedCategory && !isDialogMenuOpen"
    @update:open="
      (open) => {
        if (!open) {
          selectedCategory = undefined
        }
      }
    "
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Excluir categoria</DialogTitle>
        <DialogDescription>
          Esta ação não poderá ser desfeita e a categoria será removida permanantemente.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose>
          <Button variant="outline" class="cursor-pointer"> Cancelar </Button>
        </DialogClose>

        <Button variant="destructive" @click="mutate()" class="cursor-pointer" :disabled="isDeletePending">
          <Loading v-if="isDeletePending" class="w-12" />
          <span v-else>Deletar</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>