<template>
  <div class="modal" @click="close">
    <div class="modal-block" @click.stop>
      <h3 class="modal-block__title">
        <slot name="title"></slot>
      </h3>
      <p class="modal-block__text">
        <slot name="text"></slot>
      </p>
      <div class="modal-block__controls">
        <div @click="deleteAc" class="btn-deny">{{ $t('yes') }}</div>
        <div @click="close" class="btn-accent">{{ $t('no') }}</div>
      </div>
      <div class="close-btn">
        <icon-close @click="close"/>
      </div>
    </div>
  </div>
</template>
<script setup>
const emit = defineEmits(['close'])
function close() {
  emit('close', 'close')
}
function deleteAc() {
  emit('delete' )
}
</script>