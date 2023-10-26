<template>
  <div class="reports-block block-sm">
    <h2 class="reports-block__title">№{{ item.id }}</h2>
    <div class="reports-block__item">
      <p class="reports-block__address">
        <span v-if="item.client_address?.area">
          {{ item.client_address?.area }} {{ $t('region') }},
        </span>
        <span v-if="item.client_address?.address">
          {{ item.client_address?.address }},
        </span>
        <span v-if="item.client_address?.house_number">
          {{ item.client_address?.house_number }} {{ $t('house') }},
        </span>
        <span v-if="item.client_address?.intrance">
          {{ item.client_address?.intrance }} {{ $t('intrance') }},
        </span>
        <span v-if="item.client_address?.floor">
          {{ item.client_address?.floor }} этаж,
        </span>
        <span v-if="item.client_address?.apartment_number">
          {{ item.client_address?.apartment_number }} {{ $t('apartment') }}
        </span>
      </p>
    </div>
    <div v-if="item.shop" class="reports-block__item">
      <p class="reports-block__restaurant">{{ item.shop?.name }}</p>
      <div v-if="item.order_items.length">
        <p v-for="(order) in item.order_items" :key="order.id" class="reports-block__order reports-block__item-info">
          <span>{{ order.product.name }}, {{ order.quantity }} {{ $t('pcs') }} </span><span class="label">{{ order.amount }} ₸</span>
        </p>
      </div>
    </div>
    <div v-if="item.restaurant" class="reports-block__item">
      <p class="reports-block__restaurant">{{ item.restaurant?.name }}</p>
      <p v-for="item in item.order_items" :key="item.id" class="reports-block__order reports-block__item-info"><span>{{ item.product.name }}, {{ item.quantity }} шт.</span><span class="label">{{ item.amount }} ₸</span></p>
    </div>
    <div class="reports-block__item reports-block__item-payment-method">
      <p class="reports-block__item-title">{{ $t('payment') }}</p>
      <p v-if="item.payment_type == 'cash'" class="reports-block__item-text">{{ $t('cash') }}</p>
      <p  v-if="item.payment_type == 'card'"  class="reports-block__item-text">{{ $t('card') }}</p>
    </div>
    <div class="reports-block__item reports-block__item-payment-info">
      <p class="reports-block__item-total reports-block__item-info"><span>{{ $t('total') }}:</span><span class="label">{{item.total_price}} ₸</span></p>
      <p v-if="$route.path.includes('orders')" class="reports-block__item-total reports-block__item-info"><span>{{ $t('delivery') }}:</span><span class="label">{{ item.delivery_cost }} ₸</span></p>
      <p class="reports-block__item-status reports-block__item-info"><span>{{ $t('paymentStatus') }}:</span>
        <span v-if="item.is_paid" class="status-success">{{ $t('payed') }}</span>
        <span v-else class="status-error">{{ $t('notPayed') }}</span>
      </p>
    </div>
    <div v-if="$route.path.includes('reports')" class="reports-block__item" :style="$route.path.includes('reports') ? 'border-bottom: none; margin: 0;' : ''">
      <p class="reports-block__delivery reports-block__item-info"><span>{{ $t('delivery') }}:</span><span>{{ item.delivery_cost }} ₸</span></p>
    </div>
    <div v-show="item.is_taken && $route.path.includes('orders')" class="reports-block__controls">
      <div class="reports-block__controls-top">
        <div @click="openMap()" class="reports-block__controls-item">
          <icon-road/>
          <p>{{ $t('route') }}</p>
        </div>
        <a :href="'tel:' + item?.client?.phone_number.replace(/[^0-9+]/g, '')" class="reports-block__controls-item">
          <icon-call/>
          <p>{{ $t('sender') }}</p>
        </a>
      </div>
      <div class="reports-block__controls-bottom">
        <div @click="handleChatToken(item.id, true)" class="btn-accent">{{ $t('chat') }}</div>
      </div>
      <div v-show="item.client_accepted" ref="endOrder" class="reports-block__drag accepted">
        <div class="invisible-btn"></div>
        <icon-arrow-filled  class="drag-svg" :class="{ active : btnActive }" :style="`left: ${position.width}`"/>
        <span>{{ $t('finishOrder') }}</span>
        <div class="icon-container">
          <icon-check/>
        </div>
      </div>
      <div v-show="!item.client_accepted">
        <div v-if="item.status === 'delivered'" class="reports-block__drag loading active">
          <span>{{ $t('waiting') }}</span>
        </div>
        <div v-else-if="!loading" ref="onPlace" class="reports-block__drag" :class="{ active : item.status !== 'collecting' }">
          <div class="invisible-btn"></div>
          <icon-arrow-filled  class="drag-svg" :class="{ active : btnActive }" :style="`left: ${position.width}`"/>
          <span>{{ $t('onPlace') }}</span>
          <div class="icon-container">
            <icon-check/>
          </div>
        </div>
        <div v-else class="reports-block__drag loading active">
          <icon-loader/>
        </div>
      </div>
    </div>
    <div v-if="(!item.is_taken || !$route.path.includes('orders')) && $route.path.includes('orders')" class="reports-block__btns">
      <div @click="handleActionOrder(item.id, true)" class="btn-accent" style="width: 100%;padding: 12px;">{{ $t('agree') }}</div>
      <div @click="handleActionOrder(item.id, false)" class="btn-deny" style="width: 100%;padding: 12px;">{{ $t('disagree') }}</div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  item: Object
})
const router = useRouter()

const { finishOrder, actionOrder, completeOrder, getChatToken } = useHttp()
const endOrder = ref(null)
const onPlace = ref(null);
const btnActive = ref(false);
const position = ref({
  xStart: 0,
  xEnd: 0,
  length: 5,
  width: 5
})
let loading = ref(false)

onMounted(() => {
  addEventListener(onPlace.value)
  addEventListener(endOrder.value)
})
function handleGesture(el) {
  if (position.value.length > position.value.xStart) {
    position.value.length += 10
    position.value.width = (Math.sqrt(Math.pow(position.value.length - position.value.xStart, 2)))
    if (position.value.width >= el.clientWidth / 1.2) {
      position.value.width = el.clientWidth - 55
      btnActive.value = true
    }
  }
}
function addEventListener(el) {
  if (el) {
    el.addEventListener('touchmove', function (event) {
      if (Math.round(position.value.xStart) != Math.round(position.value.xEnd)) {
        position.value.length = event.changedTouches[0].screenX
      }
      // event.stopPropagation()
      handleGesture(el)
    }, false);
    el.addEventListener('touchend', function (event) {
      // event.stopPropagation()
      position.value.length = event.changedTouches[0].screenX;
      position.value.xEnd = event.changedTouches[0].screenX;

      if (position.value.width < el.clientWidth / 1) {
        position.value.width = 5
        loading.value = true
        if (props.item.client_accepted) {
          handleCompleteOrder(props.item.id).then(() => {
            loading.value = false
          })
        } else {
          handleFinishOrder(props.item.id).then(() => {
            loading.value = false
          })
        }
      }
      if (position.value.width >= el.clientWidth / 1) {
        position.value.width = 5
      }
    }, false);
  }
}
async function handleFinishOrder(id) {
  try {
    await finishOrder({
      delivery_order: id
    })
  } catch(e) {
    console.log(e)
  }
}
async function handleCompleteOrder(id) {
  try {
    await completeOrder({
      id: id
    })
  } catch(e) {
    console.log(e)
  }
}
async function handleActionOrder(id, status) {
  try {
    await actionOrder({
      delivery_order: id,
      accepted: status
    })
  } catch(e) {
    console.log(e)
  }
}

function openMap(location) {
  let userAgent = navigator.userAgent;
  if (userAgent.match(/iPhone|iPad|iPod/i)) {
    if (props.item.status === 'collecting') {
      if (props.item.shop) {
        window.location.replace(
            `https://www.google.com/maps/search/?api=1&query=${props.item.shop.address}`
        );
      }
      if (props.item.restaurant) {
        window.location.replace(
            `https://www.google.com/maps/search/?api=1&query=${props.item.restaurant.address}`
        );
      }
    } else {
      window.location.replace(
          `https://www.google.com/maps/search/?api=1&query=${props.item.client_address?.area ? props.item.client_address?.area + '+' : ''}${props.item.client_address?.address ? props.item.client_address?.address + '+' : ''}, ${props.item.client_address?.house_number ? props.item.client_address?.house_number + '+' : ''}${props.item.client_address?.intrance ? props.item.client_address?.intrance + ' подъезд' : ''}`
      );
    }
  } else {
    if (props.item.status === 'collecting') {
      if (props.item.shop) {
        window.location.replace(
            `geo:0,0?q=${props.item.shop.address}`
        );
      }
      if (props.item.restaurant) {
        window.location.replace(
            `geo:0,0?q=${props.item.restaurant.address}`
        );
      }
    } else {
      window.location.replace(
          `geo:0,0?q=${props.item.client_address?.area ? props.item.client_address?.area + '+' : ''}${props.item.client_address?.address ? props.item.client_address?.address + '+' : ''}, ${props.item.client_address?.house_number ? props.item.client_address?.house_number + '+' : ''}${props.item.client_address?.intrance ? props.item.client_address?.intrance + ' подъезд' : ''}`
      );
    }
  }
  // window.location.replace(`google.navigation:q=${props.item.client_address?.area ? props.item.client_address?.area + '+' : ''}${props.item.client_address?.address ? props.item.client_address?.address + '+' : ''}${props.item.client_address?.house_number ? props.item.client_address?.house_number + '+' : ''}${props.item.client_address?.intrance ? props.item.client_address?.intrance + ' подъезд' : ''}&mode=l`)
  // window.location.replace(`http://maps.apple.com/?daddr=${props.item.client_address?.area ? props.item.client_address?.area + '+' : ''}${props.item.client_address?.address ? props.item.client_address?.address + '+' : ''}${props.item.client_address?.house_number ? props.item.client_address?.house_number + '+' : ''}${props.item.client_address?.intrance ? props.item.client_address?.intrance + ' подъезд' : ''}`)
  // window.location.replace(`maps://maps.apple.com/?q=${props.item.client_address?.area ? props.item.client_address?.area + '+' : ''}${props.item.client_address?.address ? props.item.client_address?.address + '+' : ''}${props.item.client_address?.house_number ? props.item.client_address?.house_number + '+' : ''}${props.item.client_address?.intrance ? props.item.client_address?.intrance + ' подъезд' : ''}`)
}

async function handleChatToken(id, is_courier) {
  try {
    await getChatToken({pk: id, is_courier: is_courier, is_client: false}).then((res) => {
      router.push('/chat?token=' + res.chat_token)
    })
  } catch (e) {
    console.log(e)
  }
}
</script>