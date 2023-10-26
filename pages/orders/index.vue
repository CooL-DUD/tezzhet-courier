<template>
  <section class="container">
    <header class="header">
      <h2 class="header__title">{{ $t('orders') }}</h2>
    </header>
    <div v-if="loading" class="orders-list">
      <icon-big-loader/>
    </div>
    <TransitionGroup v-else-if="orders.length" name="list" tag="div" class="orders-list">
      <reports-card v-for="item in orders" :item="item" :key="item.id"/>
    </TransitionGroup>
    <div v-else class="page">
      <h3 class="placeholder-text">{{ $t('noOrders') }}</h3>
    </div>
  </section>
</template>
<script setup>
import {useCookieLocale} from "#i18n";
import Button from "~/components/common/button.vue";
const router = useRouter();
const orders = ref([])
const config = useRuntimeConfig();
let change = ref(false)
const lang = useCookieLocale()
let loading = ref(false)


if(useCookie("access_token").value || useCookie("refresh_token").value) {
  const socket = new WebSocket(`${config.public.wsUrl}/delivery_orders/?query_string=${useCookie("access_token").value}&accept-language=${lang.value}`);

  socket.onclose = (event) => {
    console.log('WebSocket connection closed: ', event);
    loading.value = false
  };

  socket.onopen = (event) => {
    console.log('WebSocket connection established.', event);
    loading.value = true
  };

  socket.onmessage = (event) => {
    orders.value = JSON.parse(event.data)
    change.value = !change.value
    loading.value = false
  };

  socket.onerror = (error) => {
    console.error('WebSocket error: ', error);
    loading.value = false
  };
  onBeforeRouteLeave(() => {
    socket.close()
  })
} else {
  router.push('/profile/login')
}
</script>