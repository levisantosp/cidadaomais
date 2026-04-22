<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query'
  import dayjs from 'dayjs'
  import { ChevronLeft, ChevronRight, Plus } from 'lucide-vue-next'
  import Loading from '~/components/loading.vue'
  import { Button } from '~/components/ui/button'
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
  } from '~/components/ui/card'
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
  } from '~/components/ui/table'
  import { api } from '~/lib/api'

  definePageMeta({
    layout: 'private'
  })

  const page = ref(1)

  const { isPending, isFetching, data, refetch } = useQuery({
    queryKey: ['units'],
    async queryFn() {
      const response = await api.units.get({
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

  const router = useRouter()
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h1 class="text-2xl font-bold">Gestão de Unidades</h1>
      <p class="text-muted-foreground text-sm">
        Veja e acompanhe as unidades cadastradas no sistema
      </p>
    </div>

    <Card>
      <CardHeader
        class="flex flex-col gap-4 pb-2 md:flex-row md:items-center md:justify-between"
      >
        <CardTitle class="text-2xl">Lista de Unidades</CardTitle>

        <NuxtLink href="/unidades/criar">
          <Button class="cursor-pointer">
            <Plus />
            Adicionar uma nova unidade
          </Button>
        </NuxtLink>
      </CardHeader>

      <CardContent>
        <div
          v-if="isPending || isFetching || !data"
          class="flex justify-center"
        >
          <Loading />
        </div>

        <div v-else>
          <div class="flex items-center justify-center space-x-2 py-2">
            <Button
              variant="outline"
              class="cursor-pointer"
              :disabled="data.page <= 1"
              @click="handlePage('previous')"
            >
              <ChevronLeft />
            </Button>
            <div>Página {{ data.page }}</div>
            <Button
              variant="outline"
              class="cursor-pointer"
              :disabled="!data.hasNextPage"
              @click="handlePage('next')"
            >
              <ChevronRight />
            </Button>
          </div>

          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Órgão</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead>Atualizada em</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow v-if="!data.data.length">
                  <TableCell
                    :colSpan="6"
                    class="text-muted-foreground text-center h-25"
                  >
                    Nenhuma unidade encontrada
                  </TableCell>
                </TableRow>

                <TableRow
                  v-else
                  v-for="unit in data.data"
                  class="text-muted-foreground cursor-pointer"
                  @click="router.push(`/unidades/${unit.id}`)"
                >
                  <TableCell>{{ unit.name }}</TableCell>
                  <TableCell>{{ unit.entity?.name ?? '-' }}</TableCell>
                  <TableCell>{{ unit.latitude }}</TableCell>
                  <TableCell>{{ unit.longitude }}</TableCell>
                  <TableCell>{{
                    dayjs(unit.createdAt).format('DD/MM/YYYY HH:mm:ss')
                  }}</TableCell>
                  <TableCell>{{
                    dayjs(unit.updatedAt).format('DD/MM/YYYY HH:mm:ss')
                  }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div class="flex items-center justify-center space-x-2 py-2">
            <Button
              variant="outline"
              class="cursor-pointer"
              :disabled="data.page <= 1"
              @click="handlePage('previous')"
            >
              <ChevronLeft />
            </Button>
            <div>Página {{ data.page }}</div>
            <Button
              variant="outline"
              class="cursor-pointer"
              :disabled="!data.hasNextPage"
              @click="handlePage('next')"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
