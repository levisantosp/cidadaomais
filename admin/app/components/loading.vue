<script setup lang="ts">
  withDefaults(
    defineProps<{
      width?: number
      height?: number
    }>(),
    {
      width: 16,
      height: 16
    }
  )
</script>

<template>
  <div class="flex justify-center">
    <div class="flex items-center gap-2 rounded-2xl">
      <div
        :style="{ width: `${width}px`, height: `${height}px` }"
        class="animate-spin rounded-full border-3 border-gray-300 border-t-blue-500"
      />
    </div>
  </div>
</template>
