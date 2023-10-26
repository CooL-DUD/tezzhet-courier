<template>
  <header class="header">
    <div @click="$router.go(-1)" class="header__icon">
      <icon-chevron/>
    </div>
    <h2 class="header__title">{{ $t('support') }}</h2>
  </header>
  <section class="container support">
    <form class="page block">
      <h3 class="support__title label">{{ $t('question') }}</h3>
      <common-select :list="[{name: $t('shop'), title: 'shop'}, {name: 'Ресторан', title: 'restaurant'}]" :field="'name'" @select="data.restaurant_or_shop = $event?.title"/>
      <common-select v-if="data.restaurant_or_shop == 'shop' && shops?.results" :list="shops.results" :field="'name'" @select="data.shop = $event.id"/>
      <common-select v-if="data.restaurant_or_shop == 'restaurant' && restaurants?.results" :list="restaurants.results" :field="'name'" @select="data.restaurant = $event.id"/>
      <textarea class="input" :class="{ 'error-input' : error }" v-model="data.question" :placeholder="$t('write')"></textarea>
      <span v-if="error" class="error-text small-text">{{ $t('errorSupport') }}</span>
      <div @click="handleSupport" class="btn-accent">{{ $t('send') }}</div>
    </form>
    <Teleport to="body">
      <modal-success v-if="isSuccess" @close="isSuccess = false">
        <template v-slot:title>{{ $t('succesSupport') }}</template>
      </modal-success>
    </Teleport>
  </section>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const { getShops, getRestaurants, support } = useHttp();
const shops = ref([]);
const restaurants = ref([]);
const data = ref({
  restaurant_or_shop: '',
  question: '',
  restaurant: 0,
  shop: 0
})
const error = ref(false)

const isSuccess = ref(false)

if (useCookie("access_token").value || useCookie("refresh_token").value) {
  getShops().then((res) => {
    shops.value = res
  });
  getRestaurants().then((res) => {
    restaurants.value = res
  });
} else {
  router.push('/profile/login')
}
async function handleSupport() {
  if (!data.value.question) {
    error.value = true
    return
  }
  try {
    await support(data.value).then((res) => {
      isSuccess.value = true
    })
  } catch (e) {
    console.log(e)
  }
}
</script>
<style lang="scss" scoped>
.select {
  margin-top: 22px;
  z-index: 2;
  & ~ & {
    margin-top: 14px;
    z-index: 1;
  }
}
</style>