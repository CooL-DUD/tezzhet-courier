<template>
  <form class="login-create" @submit.prevent="handleVerifyCode">
    <p class="login-text text-center">Вы не получили код?</p>
    <div class="login-counter" v-if="counter >= 1">
      Отправить повторно через {{ counter }}
    </div>
<!--    <div class="login-counter" v-if="counter >= 1">-->
<!--      Отправить повторно через {{ counter }} {{ type == 'min' ? 'мин' : 'сек'}}-->
<!--    </div>-->
    <div class="login-counter" @click="handleSendCode" v-else>
      Отправить повторно
    </div>
    <p class="login-text text-center">На ваш номер телефон придет код SMS</p>
    <label for="name" class="login-input net">
      <input
        type="text"
        name="login"

        placeholder="Код SMS"
        v-mask="'####'"
        v-model="smsCode"
      />
    </label>
    <common-button @click="handleVerifyCode" :loading="loading" class="login-btn">Подтвердить</common-button>
    <p class="error-text">{{error}}</p>
  </form>
</template>

<script setup>
import { useHttp } from '~/composables/useHttp.js'
const emit = defineEmits(['tab'])
let smsCode = ref("");
let counter = ref(60);
// let counterMin = ref(1);
let error = ref('')
let loading = ref(false)
// let tries = ref(0)
// let type = ref('sec')
const { sendCode, verifyCode } = useHttp();

function handleSendCode() {
  // if (tries.value > 3 && counter.value == 0) {
  //   error.value = 'Вы превысили лимит попыток'
  //   setTimerMin()
  //   return
  // }
  try {
    sendCode({
      phone: JSON.parse(localStorage.getItem('user')).username,
    })
    // tries.value++
    // localStorage.setItem('tries', JSON.stringify({tries: tries.value, counter: { start: new Date(), duration: 1 }}))
  } catch (e) {
    console.log(e)
  } finally {
    counter.value = 60
  }
}
function handleVerifyCode() {
  loading.value = true
  try {
    verifyCode({
      phone: JSON.parse(localStorage.getItem('user')).username,
      code: smsCode.value,
    })
    loading.value = false
    emit('tab');
  } catch (e) {
    loading.value = false
    if (e.response.status == 400)
      error.value = 'Неверный код'
  } finally {
    counter.value = 60
  }
}
onMounted(() => {
  // localStorage.getItem('tries') ? tries.value = JSON.parse(localStorage.getItem('tries')).tries : tries.value = 0
  // if (tries.value > 3) {
  //   setTimerMin()
  // } else {
  //   type.value = 'sec'
  // }

  // if (type.value == 'min') {
  //   setInterval(() => {
  //     if (counterMin.value >= 1) {
  //       counterMin.value--;
  //     } else {
  //       localStorage.setItem('tries', '')
  //     }
  //   }, 60000);
  // } else {
    setInterval(() => {
      if (counter.value >= 1) {
        counter.value--;
      }
    }, 1000);
  // }
} )

function setTimerMin() {
  const data = JSON.parse(localStorage.getItem('tries')).counter
  const startTime = new Date(data.start);
  const durationInMinutes = data.duration;
  const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);
  const currentTime = new Date();
  const remainingTimeInMilliseconds = endTime - currentTime;
  const remainingMinutes = Math.floor(remainingTimeInMilliseconds / 60000);
  type.value = 'min'
  counter.value = remainingMinutes
  setInterval(() => {
    if (counterMin.value >= 1) {
      counterMin.value--;
    } else {
      localStorage.setItem('tries', '')
    }
  }, 60000);
}
</script>
