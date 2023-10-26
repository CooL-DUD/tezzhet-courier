<template>
  <header class="header">
    <div @click="$router.go(-1)" class="header__icon">
      <icon-chevron/>
    </div>
    <h2 class="header__title">{{ $t('reports') }}</h2>
  </header>
  <section class="container">
    <div class="page">
      <reports-card v-for="item in report" :item="item" class="block"/>
    </div>
  </section>
</template>
<script setup>
const router = useRoute();
const report = ref({})
const { getReportDetail } = useHttp();
if(useCookie("access_token").value || useCookie("refresh_token").value) {
  getReportDetail({date:router.params.id}).then((res) => {
    report.value = res
  })
} else {
  router.push('/profile/login')
}
</script>
<style scoped lang="scss">
.block:not(:first-child) {
  margin-top: 20px;
}
</style>