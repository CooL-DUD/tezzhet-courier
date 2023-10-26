<template>
  <form @submit.prevent="login" class="login-create">
    <div v-if="block == 2">
      <label v-if="loginBy == 'phone'" for="name" class="login-input">
        <icon-phone />
        <input
            type="text"
            name="login"

            placeholder="+7 (777) 777 77 77"
            v-mask="'+7 (###)-###-##-##'"
            v-model="username"
        />
      </label>
      <label v-if="loginBy == 'email'" for="name" class="login-input">
        <icon-email />
        <input
            type="email"
            name="login"

            placeholder="E-mail"
            v-model="username"
        />
      </label>
      <label for="password" class="login-input">
        <icon-person />
        <input type="password" name="login" id="password" placeholder="Пароль" v-model="password"/>
      </label>
    </div>
    <div v-if="block == 1">
      <label @click="handleTab('email')" for="name" class="login-input">
        <p>По почте</p>
        <icon-chevron class="login-chevron"/>
      </label>
      <label @click="handleTab('phone')" for="name" class="login-input">
        <p>По номеру телефона</p>
        <icon-chevron class="login-chevron"/>
      </label>
    </div>
    <div @click="$emit('tab')" class="login-forget__btn">Забыли пароль?</div>
    <common-button @click="login" :loading="loading" class="login-btn">Войти</common-button>
    <p v-if="error" class="error-text">Неверный логин или пароль</p>
  </form>
</template>

<script setup>
import { useHttp } from '~/composables/useHttp.js'
import { useRouter } from 'vue-router';
const router = useRouter()

let phone = ref("");
let username = ref("");
let password = ref("");
let loading = ref(false);

let loginBy = ref("phone");

let block = ref(2);
let error = ref('')

const { getToken, setNotify } = useHttp();

const accessToken = useCookie('access_token')
const refreshToken = useCookie('refresh_token')

function handleTab(type) {
  if (block.value == 1) {
    block.value = 2;
  } else {
    block.value = 1;
  }
  loginBy.value = type;
}

async function login() {
  loading.value = true
  try {
    await getToken({
      username: username.value,
      password: password.value,
    }).then((res) => {
      localStorage.setItem('username', res.username)
      router.push('/profile')
      accessToken.value = res.access
      refreshToken.value = res.refresh
      setNotify(localStorage.getItem('deviceToken'), res.access)
    }).catch((e) => {
      error.value = e.message
    })
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
</style>