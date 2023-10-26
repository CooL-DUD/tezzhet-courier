<template>
  <form @submit.prevent="handleRegister" class="login-create">
    <p v-if="error" class="error-text">{{ error }}</p>
    <p v-else class="login-text text-center">Придумайте пароль</p>
    <label for="name" class="login-input">
      <icon-lock />
      <input
          type="password"
          name="login"

          placeholder="Пароль"
          v-model="password"
      />
    </label>
    <label for="name" class="login-input">
      <icon-lock />
      <input
        type="password"
        name="login"

        placeholder="Повторить пароль"
        v-model="confirm_password"
      />
    </label>
    <common-button @click="handleRegister" :loading="loading" class="login-btn">Создать</common-button>
  </form>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useHttp } from '~/composables/useHttp.js'
const router = useRouter()
const { register, getToken, setNotify } = useHttp();
const emit = defineEmits(['tab', 'error'])
let password = ref("");
let confirm_password = ref("");
let error = ref('')
let loading = ref(false)

let errorText = useError()

const accessToken = useCookie('access_token')
const refreshToken = useCookie('refresh_token')

async function handleRegister() {
  let data = JSON.parse(localStorage.getItem('user'))
  data.password = password.value
  data.role = 4
  loading.value = true

  if (password.value != confirm_password.value) {
    error.value = 'Пароли не совпадают'
    loading.value = false
    return
  } else if (password.value.length < 8) {
    error.value = 'Пароль должен быть не менее 8 символов'
    loading.value = false
  } else {
    error.value = ''

    try {
      await register(data).catch((e) => {
        errorText = e.response.data.username[0]
        emit('error', errorText)
      })
      const { access, refresh, username } = await getToken({
        username: data.username,
        password: data.password,
      })
      accessToken.value = access
      refreshToken.value = refresh
      localStorage.setItem('username', username)
      setNotify(localStorage.getItem('deviceToken'), access)

      loading.value = false
    } catch (e) {
      console.log(e)
      loading.value = false
    } finally {
      router.push('/')
      emit('tab')
    }
  }
}
</script>