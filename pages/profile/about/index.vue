<template>
  <header class="header">
    <div @click="$router.push('/profile')" class="header__icon">
      <icon-chevron/>
    </div>
    <h2 class="header__title">{{ $t('about') }}</h2>
  </header>
  <section class="container">
    <div class="about-block block page">
      <nuxt-link to="about/edit" class="about-block__card accent-text">
        <h4 class="about-block__title">{{ $t('aboutMe') }}</h4>
        <p class="about-block__text">{{ about.about }}</p>
      </nuxt-link>
      <nuxt-link to="about/edit" class="about-block__card accent-text">
        <h4 class="about-block__title">{{ $t('dream') }}</h4>
        <p class="about-block__text">{{ about.dream }}</p>
      </nuxt-link>
      <div class="about-block__progress">
        <div :style="`width: ${about.percent}%`" class="about-block__progress-bar"><icon-moped/></div>
      </div>
      <p v-if="$i18n.locale === 'ru'" class="about-block__progress-desc">Осталось: {{ 100 - about.percent }}% до исполнения<br>своей мечты</p>
      <p v-else class="about-block__progress-desc">Қалды: {{ 100 - about.percent }}% сіздің арманыңыздың<br>орындалмас бұрын</p>
      <p v-if="about.start_date" class="about-block__info"><span class="label">Дата</span>{{new Date(about.start_date).toLocaleDateString()}} - {{new Date(about.end_date).toLocaleDateString()}}</p>
      <p v-if="about.money" class="about-block__info"><span class="label">{{$t('money')}}</span>{{ about.money }} тг</p>
    </div>
  </section>
</template>
<script setup>
definePageMeta({
  middleware: 'edit'
})
import {useRouter} from "vue-router";
import {useAbout} from "~/composables/store";

const about = useAbout()
const router = useRouter()
const { getAbout } = useHttp();

onMounted(() => {
  if (useCookie("access_token").value || useCookie("refresh_token").value) {
    getAbout().then((res) => {
      about.value = res
    }).catch((e) => {
      console.log(e.response.data.message)
      router.push('/profile/about/edit')
    });
  } else {
    router.push('/profile/login')
  }
})
</script>