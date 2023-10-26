<template>
  <div class="block-sm shifts-item">
    <p class="shifts-item__title">{{ item.name }}</p>
    <div class="shifts-item__info">
      <p class="shifts-item__info-date"><icon-calendar-checked/> <span>{{ item.date }}</span></p>
    </div>
    <p class="shifts-item__period">
      <span v-if="$i18n.locale === 'ru'">c {{ item.start_time }} до {{ item.end_time }}</span>
      <span v-else>{{ item.start_time }}-ден {{ item.end_time }}-ге дейін</span>
    </p>
    <div v-if="item.is_taken_shift" class="shifts-item__info-btns">
      <div v-if="item.break_time && item.is_taken_break" class="btn-deny btn-break" @click="stopBreak(item.id)">
        <span>{{ $t('endBreak') }}</span>
        <span v-if="$i18n.locale === 'ru'">Осталось {{ counter }} мин.</span>
        <span v-else>{{ counter }} мин. қалды</span>
      </div>
      <div v-else-if="item.is_break && item.break_time" class="btn-accent btn-break" @click="getBreak(item.id)">
        <span>{{ $t('getBreak') }}</span>
        <span v-if="$i18n.locale === 'ru'">Осталось {{ item.break_time }} мин.</span>
        <span v-else>{{ item.break_time }} мин. қалды</span>
      </div>
      <div v-else-if="item.break_time && typeof  item.break_time == 'number'" class="btn" @click="open('На данный момент взять перерыв невозможно', 'Попробуйте через час')">
        <span>{{ $t('getBreak') }}</span>
        <span v-if="$i18n.locale === 'ru'">Осталось {{ item.break_time }} мин.</span>
        <span v-else>{{ item.break_time }} мин. қалды</span>
      </div>
      <div v-else class="btn" @click="open($t('cantGetBreak'), $t('tryLater'))">
        <span>{{ $t('noBreak1') }}</span>
        <span>{{ $t('noBreak2') }}</span>
      </div>
      <nuxt-link to="/orders" class="btn-accent">{{ $t('toOrders') }}</nuxt-link>
    </div>
    <div v-else class="shifts-item__info-btns">
      <div v-if="item.is_available" @click="handleShiftsAction(item.id, true)" class="btn-accent">{{ $t('agree') }}</div>
      <div v-else class="btn" @click="open($t('cantGetShift'))">{{ $t('agree') }}</div>
      <div class="btn-deny" @click="handleShiftsAction(item.id, false)">{{ $t('disagree') }}</div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  item: {
    type: Object,
  },
})
import {useHttp} from "~/composables/useHttp";

const { shiftsAction, breakGet, breakStop } = useHttp()
const emit = defineEmits(['open', 'change'])
let counter = ref(0)

onMounted(() => {
  if (props.item.break_time && props.item.is_taken_break) {
    const endTimeParts = props.item.break_time.end_time.split(':');
    const endHours = parseInt(endTimeParts[0]);
    const endMinutes = parseInt(endTimeParts[1]);

    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    const endTimeInMinutes = endHours * 60 + endMinutes;
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    let breakTimeInMinutes = endTimeInMinutes - currentTimeInMinutes;
    console.log('breakTimeInMinutes', breakTimeInMinutes)

    if (breakTimeInMinutes <= 0) {
      counter.value = 0;
    } else {
      counter.value = breakTimeInMinutes;
    }
  }
})

function timeFormatter(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000)
}
async function handleShiftsAction(id, accepted) {
  try {
    await shiftsAction({
      shift_id: id,
      accepted: accepted,
    })
    change()
  } catch(e) {
    console.log(e)
  }
}

async function getBreak(id) {
  try {
    await breakGet({
      shift_id: id
    })
    change()
  } catch(e) {
    if(e.response.status === 400) {
     open(e.response.data.error)
    }
  }
}
async function stopBreak(id) {
  try {
    await breakStop({
      shift_id: id
    })
    change()
  } catch(e) {
    console.log(e)
  }
}
function open(title = '', text = '') {
  emit('open', {title: title, text: text})
}
function change() {
  emit('change')
}
function handleCounter() {
  setTimeout(() => {
    counter.value = counter.value - 1
  }, 60000)
}

watch(counter, () => {
  if (counter.value > 0) {
    handleCounter()
  }
}, { deep: true, immediate: true })
</script>