<template>
  <div class="chat" @keyup.enter="scrollToBottom">
    <div class="chat-header">
      <header class="header">
        <div @click="$router.go(-1)" class="header__icon">
          <icon-chevron/>
        </div>
        <h2 class="header__title">Чат</h2>
      </header>
<!--      <div class="chat-banner">-->
<!--        <div class="chat-banner__logo">-->
<!--          <IconSmallLogo />-->
<!--        </div>-->
<!--        <div class="chat-banner__text">-->
<!--          <h6>Tez zhet</h6>-->
<!--          <p>Пн-Пт 9:00 - 18:00</p>-->
<!--        </div>-->
<!--        <div class="chat-banner__right">-->
<!--          <p>Открыто</p>-->
<!--          <IconGreenDot />-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <!-- Chat -->
    <div class="container">
      <div ref="container" class="chat-message">
        <div v-if="completed" class="chat-placeholder">
          <p>{{ $t("chatEnd") }}</p>
        </div>
        <div v-else class="chat-message__content">
          <div
              v-for="item in message"
              :key="item.date"
              class="chat-message__content-item">
            <p class="chat-message__date">
              {{
                new Date(item?.date).toLocaleDateString("ru", {
                  month: "long",
                  day: "numeric",
                })
              }}
            </p>
            <!--          <div class="chat-placeholder">-->
            <!--            <p>Чат пуст.</p>-->
            <!--            <p>Начните переписку</p>-->
            <!--          </div>-->
            <LazyChatMessageSms
                v-for="(sms, index) in item.messages"
                :key="index"
                :message="sms"
                :isUser="sms.sender == username" />
          </div>
        </div>
      </div>
    </div>
    <form class="chat-message__form" @submit.prevent="sendSms(sms)">
      <!--      <IconClip />-->
      <input
          class="chat-message__input"
          type="text"
          placeholder="Написать..."
          v-model="sms" />
      <button class="chat-message__btn">
        <IconSendBtn @click="scrollToBottom" />
      </button>
    </form>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

// let message = ref([
//   {
//     isUser: false,
//     name: "Администратор",
//     text: "Здравствуйте, Аза! Чем могу вам помочь?",
//   },
//   {
//     isUser: true,
//     text: "Здравствуйте!",
//   },
// ]);
const router = useRouter();
const route = useRoute();

let message = ref([]);
let connection = ref(null);
let username = ref(null);
let completed = ref(false);
let deliveryOrderId = ref(0);

let sms = ref("");
function sendSms(text) {
  connection.value.send(JSON.stringify({ message: text }));
  sms.value = "";
  scrollToBottom();
}

// function sendSms(text) {
//   message.value.push({
//     isUser: true,
//     text: text,
//   });
//   sms.value = "";
// }

onMounted(() => {
  if (!useCookie("access_token").value) {
    router.push("/profile/login");
  }
  username.value = localStorage.getItem("username");

  connection.value = new WebSocket(
      `${config.public.wsUrl}/chat/${route.query.token}/?access_token=${
          useCookie("access_token").value
      }`
  );

  connection.value.onconnect = function (event) {
    console.log(event, "onconnect");
  };

  connection.value.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.status == "chat_completed") {
      deliveryOrderId.value = data.delivery_order_id;
      completed.value = true;
    } else {
      completed.value = false;
      message.value = data.chat_history;
      scrollToBottom();
    }
  };

  connection.value.onopen = function (event) {
    console.log(event, "onopen");
  };

  connection.value.onerror = function (event) {
    console.log(event, "onerror");
  };
});

const container = ref(null);

const scrollToBottom = () => {
  if (container.value) {
    container.value.scrollTop = container.value.scrollHeight;
  }
};
</script>