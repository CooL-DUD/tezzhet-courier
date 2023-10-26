<template>
  <div @click="openSelect" class="select">
    <p class="select__value">
      <span>{{ value }}</span><icon-chevron class="select__icon"/>
    </p>
    <div ref="selectList" class="select__list">
      <p v-for="item in props.list" @click="handleSelect(item)" class="select__list-item">{{ item[field] }}</p>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  list: Array,
  field: String
})
const emit = defineEmits(['select'])
  let value = ref(props?.list[0][props?.field]);
  let selectList = ref(null);
  function handleSelect(item) {
    document.querySelector('.select__list-item.active')?.classList.remove('active');
    value.value = item[props.field];
    emit('select', item)
    event.target.classList.add('active');
  }
  function openSelect() {
    selectList.value.classList.toggle('active');
  }
</script>
<style></style>