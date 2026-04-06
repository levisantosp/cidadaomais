<script setup lang="ts">
const delays = ["0s", "-1.1s", "-0.9s"];

const props = withDefaults(
  defineProps<{
    width?: number;
    height?: number;
  }>(),
  {
    width: 12,
    height: 12
  }
);
</script>

<template>
  <div
    class="inline-flex items-center justify-center"
    :style="{
      gap: `${Math.max(props.width * 0.25, 3)}px`,
      '--dot-jump': `${Math.max(props.height * 1.25, 15)}px`
    }"
  >
    <span
      v-for="delay in delays"
      :key="delay"
      class="loading-dot inline-block rounded-full bg-current opacity-80"
      :style="{
        width: `${props.width}px`,
        height: `${props.height}px`,
        animationDelay: delay
      }"
    />
  </div>
</template>

<style scoped>
.loading-dot {
  animation: loading-wave 1.3s linear infinite;
}

@keyframes loading-wave {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.55;
  }

  30% {
    transform: translateY(calc(var(--dot-jump) * -1));
    opacity: 1;
  }
}
</style>
