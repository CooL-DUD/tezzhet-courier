<template>
  <form class="login-create" @submit.prevent="handleSendCode">
    <label for="name" class="login-input"
           :class="{'error-input' : validation.name}"
    >
      <icon-person/>
      <input
          type="text"
          name="login"

          placeholder="Имя"
          v-model="name"
          @blur="validate('name')"
      />
    </label>
    <span class="error-text small-text">{{ validation.name }}</span>
    <label for="name" class="login-input"
           :class="{'error-input' : validation.phone }"
    >
      <icon-phone/>
      <input
          type="text"
          name="login"

          placeholder="+7 (777) 777 77 77"
          v-mask="'+7 (###)-###-##-##'"
          v-model="phone"
          @blur="validate('phone')"
      />
    </label>
    <span class="error-text small-text">{{ validation.phone }}</span>
    <common-button :loading="loading" class="login-btn">Получить код</common-button>
    <p v-if="error" class="error-text">{{ error }}</p>
  </form>
</template>

<script setup>
import {useHttp} from '~/composables/useHttp.js'

const emit = defineEmits(['tab'])
let phone = ref("");
let name = ref("");
let error = ref("")
let loading = ref(false)
let validation = ref({})
const {sendCode} = useHttp();

async function handleSendCode() {
  validate('phone')
  validate('name')
  if (Object.keys(validation.value).length > 0) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    await sendCode({
      phone: phone.value,
    }).then((res) => {
      emit('tab')
    })
    localStorage.setItem('user', JSON.stringify({
      first_name: name.value,
      username: phone.value,
    }))
  } catch (e) {
    console.log('e: ', e)
    error.value = e.response.data.error
    loading.value = false
  }
}

function validate(type) {
  switch (type) {
    case 'phone':
      if (phone.value.length < 1) {
        validation.value.phone = 'Введите номер телефона'
      } else if (phone.value.length < 18) {
        validation.value.phone = 'Неверный номер телефона'
      } else {
        delete validation.value.phone
      }
      break
    case 'name':
      if (name.value.length < 1) {
        validation.value.name = 'Введите имя'
      } else {
        delete validation.value.name
      }
      break
  }
}
</script>
