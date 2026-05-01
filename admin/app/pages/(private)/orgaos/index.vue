<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-vue-next'
import Loading from '~/components/loading.vue'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { api } from '~/lib/api'

definePageMeta({
  layout: 'private'
})

const page = ref(1)
const router = useRouter()

const { isPending, isFetching, data, refetch } = useQuery({
  queryKey: ['services'],
  async queryFn() {
    const response = await api.entities.get({
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
      <h1 class="text-2xl font-bold">Gestão de Órgãos</h1>
      <p class="text-muted-foreground text-sm">Veja e acompanhe os órgãos cadastrados no sistema</p>
    </div>

    <Card>
      <CardHeader class="flex flex-col gap-4 pb-2 md:flex-row md:items-center md:justify-between">
        <CardTitle class="text-2xl">Lista de Órgãos</CardTitle>

        <NuxtLink href="/orgaos/criar">
          <Button class="cursor-pointer">
            <Plus />
            Adicionar um novo órgão
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
                  <TableHead>Descrição</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead>Atualizada em</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow v-if="!data.data.length">
                  <TableCell :colSpan="7" class="text-muted-foreground text-center h-25">
                    Nenhum órgão encontrado
                  </TableCell>
                </TableRow>

                <TableRow
                  v-else
                  v-for="entity in data.data"
                  class="text-muted-foreground cursor-pointer"
                  @click="router.push(`/orgaos/${entity.id}`)"
                >
                  <TableCell>{{ entity.name }}</TableCell>
                  <TableCell class="max-w-80 whitespace-normal wrap-break-word">{{ entity.description }}</TableCell>
                  <TableCell>{{ entity.phone }}</TableCell>
                  <TableCell>{{ entity.email }}</TableCell>
                  <TableCell>{{ entity.website ?? '-' }}</TableCell>
                  <TableCell>{{ dayjs(entity.createdAt).format('DD/MM/YYYY HH:mm:ss') }}</TableCell>
                  <TableCell>{{ dayjs(entity.updatedAt).format('DD/MM/YYYY HH:mm:ss') }}</TableCell>
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
</template>