<template>
  <div class="date">
    <icon-calendar-checked/>
<!--    <span>{{new Date(date).toLocaleDateString($i18n.locale, {month:"short", day:"numeric"})}}</span>-->
    <span>{{date.split('.')[0] + '.' + date.split('.')[1]}}</span>
  </div>
</template>
<script setup>
defineProps({
  date: String
})
</script>
<style>
.date {
  display: flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
}
</style>