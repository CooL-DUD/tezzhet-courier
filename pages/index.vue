<template>
  <section class="section">
    <header class="header">
      <h2 class="header__title">{{ $t('shifts') }}</h2>
    </header>
    <div class="page container">
      <div v-if="shifts.length" class="shifts-list">
        <TransitionGroup name="list" tag="div" class="shifts-list">
<!--          <shifts-item v-for="item in shifts" @open="handleOpen" :item="item" @change="handleGetShifts" :key="{id: item.id, break_time: item.break_time}"/>-->
          <shifts-item v-for="item in shifts" @open="handleOpen" :item="item" @change="handleGetShifts" :key="item.id + item.break_time + JSON.stringify(item)"/>
        </TransitionGroup>
      </div>
      <div v-else class="placeholder-text">
        <p>{{ $t('noShifts') }}</p>
      </div>
    </div>
    <Teleport to="body">
      <modal-shifts v-if="openModal" @close="openModal = false">
        <template v-slot:title>
          {{modal.title}}
        </template>
        <template v-slot:text>
          {{modal.text}}
        </template>
      </modal-shifts>
    </Teleport>
  </section>
</template>
<script setup>
  import { useRouter } from 'vue-router';
  const { getShifts } = useHttp();
  const router = useRouter()
  const openModal = ref(false)
  const modal = ref({
    title: '',
    text: '',
  })
  const shifts = ref([])
    if(useCookie("access_token").value || useCookie("refresh_token").value) {
      handleGetShifts()
    } else {
      router.push('/profile/login')
    }

  // onMounted(async () => {
  //   await setNotify(localStorage.getItem('deviceToken'))
  // })

  function handleGetShifts() {
    console.log('handleGetShifts')
    getShifts().then((res) => {
      shifts.value = res
    })
  }
  function handleOpen(open) {
    openModal.value = true;
    modal.value = open
  }
</script>
<style scoped lang="scss">
.container {
  overflow: scroll;
  max-height: 85vh;
}
//.page {
//  margin-top: 0;
//}
</style>