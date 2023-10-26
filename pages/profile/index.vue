<template>
  <section>
    <header class="header">
      <h2 class="header__title">{{ $t('profile') }}</h2>
    </header>
    <div class="page">
      <div class="profile-info container">
        <div class="profile-info__top">
          <div class="profile-info__top-item">
            <div v-if="profile?.image" @click="$refs.uploadImage.click()" class="profile-info__img">
              <img :src="profile?.image" alt="">
            </div>
            <div v-else class="profile-info__img" @click="$refs.uploadImage.click()">
              <p>{{profile?.first_name[0]}}</p>
            </div>
            <div class="profile-info__text">
              <h3 class="profile-info__name">{{ profile?.first_name }}</h3>
              <p class="profile-info__phone">{{ profile?.username }}</p>
<!--              <p class="profile-info__email">{{ profile?.username }}</p>-->
            </div>
          </div>
          <input
              style="display: none"
              ref="uploadImage"
              type="file"
              accept="image/*"
              @change="handleUpdateAvatar"
          >
          <p class="accent-text">Рейтинг {{ profile?.rating }}</p>
        </div>
        <p v-if="profile?.shift" class="profile-info__bottom accent-text">
          {{ profile.shift?.shift_type }}: {{ profile.shift?.start_time }} - {{ profile.shift?.end_time }}
        </p>
      </div>
      <div class="profile-links">
        <ProfileLinkItem :to="'profile/about'">
          <icon-wand />
          <p class="reports-item__title">{{ $t('about') }}</p>
        </ProfileLinkItem>
        <ProfileLinkItem :to="'profile/reports'">
          <icon-calendar />
          <p class="reports-item__title">{{ $t('reports') }}</p>
        </ProfileLinkItem>
        <ProfileLinkItem :to="'profile/support'">
          <icon-support />
          <p class="reports-item__title">{{ $t('support') }}</p>
        </ProfileLinkItem>
        <ProfileLinkItem :to="'profile/language'">
          <icon-globus />
          <p class="reports-item__title">{{ $t('lang') }}</p>
        </ProfileLinkItem>
      </div>
      <div class="exit-btn" @click="logout">{{ $t('exit') }}</div>
      <div class="delete-account-btn" @click="isDelete = true">{{ $t('deleteAcc') }}</div>
      <Teleport to="body">
        <modal-delete v-if="isDelete" @close="isDelete = false" @delete="handleDelete">
          <template v-slot:title>{{ $t('deleteAccSure') }}</template>
        </modal-delete>
      </Teleport>
    </div>
  </section>
</template>
<script setup>
import { useHttp } from "~/composables/useHttp.js";
import { useRouter } from "vue-router";
import {useCookie} from "#app";

const { getProfile, deleteAuth, updateAvatar } = useHttp();
const router = useRouter();
const uploadImage = ref(null)

const profile = ref(null);
let isDelete = ref(false);
let token = useCookie("access_token");
let refresh = useCookie("refresh_token");

function logout() {
  useCookie("access_token").value = null;
  useCookie("refresh_token").value = null;
  router.push("/profile/login");
}
async function handleDelete() {
  await deleteAuth().then((res) => {
    console.log(res);
    token.value = ''
    refresh.value = ''
    router.push("/profile/login");
  });
}

async function handleUpdateAvatar(e) {
  profile.value.image = URL.createObjectURL(e.target.files[0]);
  // profile.value.image = e.target.files[0];
  const formData = new FormData();
  formData.append("main_image", e.target.files[0]);
  await updateAvatar(formData).then((res) => {
    // this.transport.image = res.data.file_name;
    console.log(res)
  });
}

if (token.value || refresh.value) {
  getProfile().then((res) => {
    profile.value = res;
  });
}
else {
  router.push("/profile/login");
}
// onMounted(async () => {
//   await setNotify(localStorage.getItem('deviceToken'))
// })
</script>