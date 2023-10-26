<template>
  <div class="spinner">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.spinner {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<script setup lang="ts">
</script>