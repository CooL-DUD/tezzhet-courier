<template>
  <div class="login-forgot">
    <form @submit.prevent="handleSendCode" v-if="isShowPhone" class="login-create">
      <p class="login-text text-center">Введите номер телефона</p>
      <label for="name" class="login-input net">
        <input
          type="text"
          name="phone"
          id="phone"
          placeholder="+7 (777) 777 77 77"
          v-mask="'+7 (###)-###-##-##'"
          v-model="phone"
        />
      </label>
      <common-button :loading="loading" class="login-btn">Получить код</common-button>
    </form>
    <form @submit.prevent="handleVerifyCode" v-if="isShowSms" class="login-create">
      <p class="login-text text-center">Вы не получили код?</p>
      <div class="login-counter" v-if="counter >= 1">
        Отправить повторно через {{ counter }}
      </div>
      <div class="login-counter" @click="counter = 60" v-else>
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
      <common-button :loading="loading" class="login-btn">Подтвердить</common-button>
    </form>
    <form @submit.prevent="handleChangePassword" v-if="isShowPassword" class="login-create">
      <p class="login-text text-center">Восстановление пароля</p>
      <p v-if="error" class="error-text">{{ error }}</p>
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
          v-model="passwordSecond"
        />
      </label>
      <common-button :loading="loading" class="login-btn">Сменить пароль</common-button>
    </form>
    <Teleport to="body">
      <modal-success v-if="isSuccess" @close="toLogin">
        <template v-slot:title>{{ modalText }}</template>
      </modal-success>
    </Teleport>
  </div>
</template>

<script setup>
import { useHttp } from "~/composables/useHttp.js";
const router = useRouter();

let smsCode = ref("");
let counter = ref(60);
let phone = ref();
let password = ref();
let passwordSecond = ref();
let error = ref('')
let loading = ref(false)

let isShowPhone = ref(true);
let isShowSms = ref(false);
let isShowPassword = ref(false);

let isSuccess = ref(false);
let modalText = ref("");

const { sendRecoveryCode, verifyCode, changePassword } = useHttp();

function handleSendCode() {
  sendRecoveryCode({
    phone: phone.value,
  })
    .then(() => {
      isShowPhone.value = false;
      isShowSms.value = true;
      setInterval(() => {
        if (counter.value >= 1) {
          counter.value--;
        }
      }, 1000);
    })
    .catch((e) => {
      console.log(e);
    });
}

function handleVerifyCode() {
  verifyCode({
    phone: phone.value,
    code: smsCode.value,
  }).then((res) => {
    counter.value = 60;
    if (res.success) {
      isShowSms.value = false;
      isShowPassword.value =true
    }
  });
}

function handleChangePassword() {
  if (password.value != passwordSecond.value) {
    error.value = 'Пароли не совпадают'
    loading.value = false
    return
  } else if (password.value.length < 8) {
    error.value = 'Пароль должен быть не менее 8 символов'
    loading.value = false
  } else {
    error.value = ''
    changePassword({
      username: phone.value,
      new_password: password.value
    }).then((res) => {
      isSuccess.value = true;
      modalText.value = res.status;
    });
  }
}

function toLogin() {
  isSuccess.value = false
  window.location.href = "/profile/login";
}
</script>

<style lang="scss" scoped>
</style>