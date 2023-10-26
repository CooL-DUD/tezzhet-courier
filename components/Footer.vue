<template>
  <footer class="footer">
    <nuxt-link
        to="/orders"
        :class="router.fullPath.includes('orders') ? 'footer-one__active' : 'footer-one'"
    >
      <icon-cart />
      {{ $t('orders') }}
    </nuxt-link>
    <nuxt-link
        to="/"
        :class="
        router.fullPath === '/'
          ? 'footer-one__active'
          : 'footer-one'
      "
    >
      <icon-shift />
      {{ $t('shifts') }}
    </nuxt-link>
    <nuxt-link
        to="/profile"
        :class="
        router.fullPath.includes('profile') ? 'footer-one__active' : 'footer-one'
      "
    >
      <icon-person />
      Профиль
    </nuxt-link>
  </footer>
</template>

<script setup>
const router = useRoute();
</script>
