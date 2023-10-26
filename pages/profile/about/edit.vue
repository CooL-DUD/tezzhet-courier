<template>
  <header class="header">
    <div @click="$router.go(-1)" class="header__icon">
      <icon-chevron/>
    </div>
    <h2 class="header__title">{{ $t('about') }}</h2>
  </header>
  <section class="container">
    <form @submit.prevent="handleCreateAbout" class="about-form block page">
      <div class="about-form__item">
        <label for="" class="accent-text">{{ $t('writeAbout') }}</label>
        <textarea v-model="about.about" @blur="validate('about')" class="input" :class="{'error-input': validation.about}" :placeholder="$t('write')"></textarea>
      </div>
      <div class="about-form__item">
        <label for="" class="accent-text">{{ $t('dream') }}</label>
        <textarea v-model="about.dream" @blur="validate('dream')" class="input" :class="{'error-input': validation.dream}" :placeholder="$t('write')"></textarea>
      </div>
      <div class="about-form__item">
        <label for="" class="label">Дата</label>
        <input v-model="about.start_date" @blur="validate('start_date')" type="date" class="input" :class="{'error-input': validation.start_date}" placeholder="28.04.2023 - 01.01.2024">
        <input v-model="about.end_date" @blur="validate('end_date')" type="date" class="input" :class="{'error-input': validation.end_date}" placeholder="28.04.2023 - 01.01.2024">
      </div>
      <div class="about-form__item">
        <label for="" class="label">{{ $t('money') }}</label>
        <input v-model="about.money" @blur="validate('money')" :class="{'error-input': validation.money}" type="number" class="input" placeholder="100000$">
      </div>
      <div class="btn-accent" @click="handleCreateAbout">{{ $t('save') }}</div>
    </form>

    <Teleport to="body">
      <modal-success v-if="isSuccess" @close="closeModal">
        <template v-slot:title>{{ $t('success') }}</template>
      </modal-success>
    </Teleport>
  </section>
</template>
<script setup>
import { useHttp } from '~/composables/useHttp.js'
import {useAbout} from "~/composables/store";
const { createAbout } = useHttp()
const about = useAbout()
const isSuccess = ref(false)
const router = useRouter()
let validation = ref({})
async function handleCreateAbout() {
  validate('about')
  validate('dream')
  validate('start_date')
  validate('end_date')
  validate('money')
  if (Object.keys(validation.value).length > 0) {
    return
  }
  try {
    await createAbout(about.value).then(res => {
      isSuccess.value = true
    })
  } catch (e) {
    console.log(e)
  }
}

function closeModal() {
  isSuccess.value = false
  router.push('/profile/about')
}


function validate(type) {
  switch (type) {
    case 'about':
      if (about.value.about.length < 1) {
        validation.value.about = 'Напишите о себе'
      } else {
        delete validation.value.about
      }
      break
    case 'dream':
      if (about.value.dream.length < 1) {
        validation.value.dream = 'Напишите о мечте'
      } else {
        delete validation.value.dream
      }
      break
    case 'start_date':
      if (!about.value.start_date) {
        validation.value.start_date = 'Введите дату начала'
      } else {
        delete validation.value.start_date
      }
      break
    case 'end_date':
      if (!about.value.end_date) {
        validation.value.end_date = 'Введите дату окончания'
      } else {
        delete validation.value.end_date
      }
      break
    case 'money':
      if (!about.value.money) {
        validation.value.money = 'Введите сумму'
      } else {
        delete validation.value.money
      }
      break
  }
}
</script>