<template>
  <button class="btn">
    <icon-loader v-if="loading"/>
    <slot v-else></slot>
  </button>
</template>
<script setup>
defineProps({
  loading: Boolean
})
</script>
<style scoped>
.btn {
  display: block;
}
</style>