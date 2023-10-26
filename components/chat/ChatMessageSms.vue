<template>
  <div
    class="chat-message__item chat-message__companion"
    :class="{
      'chat-message__companion': !isUser,
      'chat-message__user': isUser,
    }"
  >
    <p v-if="message.sender" class="chat-message__name">{{ message.sender_name }}</p>
    <p
      :class="{
        'chat-message__sms': !isUser,
        'chat-message_smsUser': isUser,
      }"
    >
      {{ message.message }}
    </p>
    <p class="chat-message__time">{{ message.datetime.split('#')[1] }}</p>
  </div>
</template>
  
  <script setup>
defineProps({
  message: Object,
  isUser: Boolean
});
</script>
  
<style scoped>
body {
  padding-bottom: 0px !important;
}
</style>