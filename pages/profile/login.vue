<template>
  <header class="header py-15 px-10">
    <h2 class="text-center">Профиль</h2>
  </header>
  <section class="container">
    <div class="login">
      <div class="login-top">
        <div class="login-top__input">
          <input
            type="radio"
            name="login"
            id="login1"
            style="display: none"
            :checked="tab === 1"
          />
          <label @click="(tab = 1), (createTab = 1)" for="login1">
            Создать аккаунт
          </label>
        </div>
        <div class="login-top__border"></div>
        <div class="login-top__input">
          <input
            type="radio"
            name="login"
            id="login2"
            :checked="tab === 2"
            style="display: none"
          />
          <label @click="(tab = 2), (logintab = 1)" for="login2"> Войти </label>
        </div>
      </div>
      <div class="container">
        <LoginCreate v-if="tab === 1 && createTab === 1" @tab="createTab = 2" :error-from="error" :key="error"/>
        <LoginCreateSms
          v-else-if="tab === 1 && createTab === 2"
          @tab="createTab = 3"
        />
        <LoginCreatePassword v-else-if="tab === 1 && createTab === 3" @error="console.log($event)"/>
        <Login v-else-if="tab === 2 && logintab === 1" @tab="logintab = 2" />
        <LoginForgotPassword v-else-if="tab === 2 && logintab === 2" @tab="logintab = 3" />
        <LoginPassword v-else-if="tab === 2 && logintab === 3" />
      </div>
    </div>
  </section>
</template>

<script setup>

const route = useRoute();
const router = useRouter();
let tab = ref(1);
let createTab = ref(1);
let logintab = ref(1);
let error = ref(false)

onMounted(() => {
  console.log(route.query.deviceToken)
  localStorage.setItem('deviceToken', route.query.deviceToken)
  if (useCookie('refresh_token').value || useCookie('access_token').value) {
    router.push('/profile')
  }
  // if (useCookie('access_token') || useCookie('refresh_token')) {
  //   router.push('/profile')
  // }
});
</script>
