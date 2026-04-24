<script setup lang="ts">
  import { useMutation, useQuery } from '@tanstack/vue-query'
  import { toTypedSchema } from '@vee-validate/zod'
  import { Edit, Trash, Undo2 } from 'lucide-vue-next'
  import { Map as Maplibre, Marker } from 'maplibre-gl'
  import 'maplibre-gl/dist/maplibre-gl.css'
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
  import { api } from '~/lib/api'

  definePageMeta({
    layout: 'private'
  })

  const router = useRouter()
  const route = useRoute()

  const { isPending, isFetching, error, data, refetch } = useQuery({
    queryKey: ['units', route.params.id],
    async queryFn() {
      if (!route.params.id) {
        throw new Error()
      }

      const response = await api
        .units({
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
      router.push('/unidades')
    }
  })

  const schema = z.object({
    name: z
      .string('Informe o nome')
      .min(2, 'O nome precisa ter no mínimo 2 caracteres')
      .trim(),
    latitude: z
      .number('Selecione a localização no mapa')
      .min(-90, 'Latitude inválida')
      .max(90, 'Latitude inválida'),
    longitude: z
      .number('Selecione a localização no mapa')
      .min(-180, 'Longitude inválida')
      .max(180, 'Longitude inválida')
  })
  const { defineField, errors, handleSubmit, resetForm, setFieldValue } =
    useForm({
      validationSchema: toTypedSchema(schema)
    })

  const [name, nameProps] = defineField('name')

  const editValues = ref<{
    name: string
    latitude: number
    longitude: number
  }>()
  const isDialogOpen = ref(false)
  const mapContainer = ref<HTMLElement>()
  const editMapContainer = ref<HTMLElement>()
  const map = shallowRef<Maplibre>()
  const editMap = shallowRef<Maplibre>()
  const marker = shallowRef<Marker>()
  const editMarker = shallowRef<Marker>()

  const createMap = (
    container: HTMLElement,
    long: number,
    lat: number,
    draggable = false
  ) => {
    return new Maplibre({
      container,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [long, lat],
      zoom: 12,
      interactive: draggable
    })
  }

  const updateMarker = (
    currentMap: Maplibre,
    currentMarker: typeof marker,
    long: number,
    lat: number,
    draggable = false
  ) => {
    if (!currentMarker.value) {
      currentMarker.value = new Marker({
        draggable
      })
        .setLngLat([long, lat])
        .addTo(currentMap)

      if (draggable) {
        currentMarker.value.on('dragend', () => {
          const position = currentMarker.value?.getLngLat()

          if (!position) {
            return
          }

          updateLocation(position.lng, position.lat)
        })
      }

      return
    }

    currentMarker.value.setLngLat([long, lat])
  }

  const updateLocation = (long: number, lat: number) => {
    setFieldValue('latitude', lat)
    setFieldValue('longitude', long)

    if (!editMap.value) {
      return
    }

    updateMarker(editMap.value, editMarker, long, lat, true)
  }

  const renderMap = async () => {
    if (!data.value) {
      return
    }

    await nextTick()

    if (!mapContainer.value) {
      return
    }

    if (!map.value) {
      map.value = createMap(
        mapContainer.value,
        data.value.longitude,
        data.value.latitude
      )
    }

    map.value.setCenter([data.value.longitude, data.value.latitude])
    updateMarker(map.value, marker, data.value.longitude, data.value.latitude)
  }

  const renderEditMap = async () => {
    if (!editValues.value) {
      return
    }

    await nextTick()

    if (!editMapContainer.value) {
      return
    }

    if (!editMap.value) {
      editMap.value = createMap(
        editMapContainer.value,
        editValues.value.longitude,
        editValues.value.latitude,
        true
      )

      editMap.value.on('click', (event) =>
        updateLocation(event.lngLat.lng, event.lngLat.lat)
      )
    }

    editMap.value.setCenter([
      editValues.value.longitude,
      editValues.value.latitude
    ])
    updateMarker(
      editMap.value,
      editMarker,
      editValues.value.longitude,
      editValues.value.latitude,
      true
    )
  }

  const handleDialogOpen = (open: boolean) => {
    isDialogOpen.value = open

    if (!open || !data.value) {
      editValues.value = undefined
      editMarker.value?.remove()
      editMarker.value = undefined
      editMap.value?.remove()
      editMap.value = undefined
      return
    }

    editValues.value = {
      name: data.value.name,
      latitude: data.value.latitude,
      longitude: data.value.longitude
    }

    resetForm({
      values: editValues.value
    })

    renderEditMap()
  }

  watch(data, () => renderMap(), {
    immediate: true
  })

  const { isPending: isMutationPending, mutate } = useMutation({
    async mutationFn(formData: z.infer<typeof schema>) {
      if (!data.value || !editValues.value) {
        throw new Error()
      }

      const response = await api
        .units({
          id: data.value.id.toString()
        })
        .put(formData)
      if (response.error) {
        throw response.error.value
      }

      editValues.value = undefined
      isDialogOpen.value = false
      editMarker.value?.remove()
      editMarker.value = undefined
      editMap.value?.remove()
      editMap.value = undefined
    },
    onError(e) {
      toast.error('Ocorreu um erro inesperado...', {
        description: e.message
      })
      console.error(e)
    },
    async onSuccess() {
      toast.success('Unidade atualizada com sucesso!')
      await refetch()
    }
  })

  const { isPending: isDeletePending, mutate: handleDelete } = useMutation({
    async mutationFn() {
      if (!route.params.id) {
        throw new Error()
      }

      const response = await api
        .units({
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
      toast.success('Unidade deletada com sucesso!')
      router.push('/unidades')
    }
  })

  const onSubmit = handleSubmit((data) => mutate(data))

  onBeforeUnmount(() => {
    marker.value?.remove()
    map.value?.remove()
    editMarker.value?.remove()
    editMap.value?.remove()
  })
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
          @click="router.push('/unidades')"
        >
          <Undo2 />
        </Button>

        <div>
          <h1 class="md:text-3xl text-2xl font-bold">Detalhes da Unidade</h1>
          <p class="text-muted-foreground text-sm md:text-lg">
            Visualize e gerencie as informações desta unidade
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
              <CardTitle>Órgão</CardTitle>
              <CardDescription>{{ data.entity?.name ?? '-' }}</CardDescription>

              <CardTitle>Latitude</CardTitle>
              <CardDescription>{{ data.latitude }}</CardDescription>

              <CardTitle>Longitude</CardTitle>
              <CardDescription>{{ data.longitude }}</CardDescription>

              <CardTitle>Localização</CardTitle>
              <CardDescription>
                <div
                  ref="mapContainer"
                  class="h-128 overflow-hidden rounded-md border"
                />
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
        <DialogDescription
          >Edite as informações desta unidade</DialogDescription
        >
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
            <Label>Localização</Label>

            <div
              ref="editMapContainer"
              class="h-128 overflow-hidden rounded-md border"
            />

            <span
              v-if="errors.latitude || errors.longitude"
              class="text-sm text-red-400"
            >
              {{ errors.latitude || errors.longitude }}
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