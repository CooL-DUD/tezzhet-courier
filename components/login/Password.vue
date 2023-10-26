<template>
  <form class="login-create">
    <p class="login-text text-center">Восстановление пароля</p>
    <label for="name" class="login-input">
      <icon-lock />
      <input type="password" name="login"  placeholder="Пароль" />
    </label>
    <label for="name" class="login-input">
      <icon-lock />
      <input
        type="password"
        name="login"

        placeholder="Повторить пароль"
      />
    </label>
    <div @click="$emit('tab')" class="login-btn">Сменить пароль</div>
  </form>
</template>

<script setup></script>
