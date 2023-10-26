<template>
  <div>
    <Swipe>
      <slot />
    </Swipe>
    <Footer v-if="!$route.fullPath.includes('chat')" />
  </div>
</template>
<script setup>

import { useNuxtApp } from '#app'
import { useRouter } from 'vue-router';
const router = useRouter()

const nuxtApp = useNuxtApp()

nuxtApp.$bus.$on('swipe', (direction) => {
  switch (direction) {
    // case 'left':
    //   router.go(-1)
    //   break;
    // case 'right':
    //   router.go(-1)
    //   break;
    case 'down':
      let startY
      document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
      });
      document.addEventListener('touchend', (e) => {
        if (startY < 200) {
          window.location.reload()
        }
      });
      break;
    default:
      break;
  }
})

useHead({
  meta: [{
    name: 'viewport',
    content: 'width=device-width, initial-scale=1'
  }]
})
</script>