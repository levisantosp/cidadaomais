import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

export default defineNuxtPlugin((app) => {
  app.vueApp.use(VueQueryPlugin, {
    queryClient: new QueryClient()
  })
})