<template>
    <header class="header">
      <div @click="$router.go(-1)" class="header__icon">
        <icon-chevron/>
      </div>
      <h2 class="header__title">{{ $t('lang') }}</h2>
    </header>
  <section class="language">
    <common-radio :label="'languageKZ'" :checked="$i18n.locale === 'kz'" @check="($i18n.setLocale('kz')), handleUpdateLang('kz')">Қазақ тілі</common-radio>
    <common-radio :label="'languageRU'" :checked="$i18n.locale === 'ru'" @check="($i18n.setLocale('ru')), handleUpdateLang('ru')">Русский язык</common-radio>
  </section>
</template>
<script setup>
const { updateLang } = useHttp();
const router = useRouter();
let lang = useCookieLocale();

async function handleUpdateLang(locale) {
  await updateLang({language: locale}).then(() => {
    lang.value = locale
  })
}
</script>
