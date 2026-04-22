import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@vee-validate/zod',
        'vee-validate',
        'zod',
        'clsx',
        'tailwind-merge',
        'class-variance-authority',
        'reka-ui',
        '@vueuse/core',
        'lucide-vue-next',
        'vue-sonner',
        'better-auth/vue',
        '@elysiajs/eden',
        '@tanstack/vue-query',
        'dayjs'
      ]
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'SOURCEMAP_BROKEN') return
          warn(warning)
        }
      }
    }
  },
  css: ['./app/assets/main.css'],
  modules: ['@nuxt/fonts', '@nuxt/image'],
  components: [
    {
      path: './app/components',
      ignore: ['./app/components/ui/**/index.ts']
    }
  ],
  ssr: false,
  nitro: {
    preset: 'bun'
  }
})
