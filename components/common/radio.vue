<template>
  <label :for="label" class="radio">
    <p class="radio__text"><slot></slot></p>
    <div class="radio__input">
      <input
          type="radio"
          :id="label"
          name="language"
          style="display: none"
          @click="$emit('check')"
          ref="input"
      />
      <label :for="label"></label>
    </div>
  </label>
</template>
<script setup>
const input = ref(null)
const props = defineProps({
  label: String,
  checked: Boolean
})
onMounted(() => {
  if (props.checked) {
    input.value.click()
  }
})
</script>
<style scoped lang="scss">
.radio {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  border-bottom: 1px solid #e3e8eb;
  &__text {
    font-family: "Nunito";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #22242f;
  }
  &__input {
    & input[type="radio"] + label {
      width: 20px;
      height: 20px;
      border: 1px solid #8f64eb;
      border-radius: 50%;
      padding: 4px;
      display: block;
      transition: all;
      position: relative;
    }
    & input[type="radio"] + label::after {
      content: "";
      position: absolute;
      width: 60%;
      height: 60%;
      background: transparent;
      border-radius: 50%;
      display: block;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition-duration: 300ms;
      position: relative;
    }
    & input[type="radio"]:checked + label::after {
      content: "";
      position: absolute;
      width: 60%;
      height: 60%;
      background: #8f64eb;
      border-radius: 50%;
      display: block;
      border: 1px solid #8f64eb;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>