import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()]
  },

  css: ['./app/assets/main.css'],
  modules: ['@nuxt/fonts'],
  components: [
    {
      path: './app/components',
      ignore: ['./app/components/ui/**/index.ts']
    }
  ]
})
