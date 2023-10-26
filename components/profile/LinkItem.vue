<template>
  <nuxt-link :to="to" class="links-item">
    <slot></slot>
    <icon-chevron class="chevron-right"/>
  </nuxt-link>
</template>
<script setup>
defineProps({
  to: {
    type: String,
  },
});
</script>