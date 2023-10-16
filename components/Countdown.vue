<script setup lang="ts">
import {
  RemainingTime,
  calculateRemainingTime,
  zeroPad,
} from '@/domain/countdown'

const props = defineProps({
  target: {
    type: Number,
    required: true,
  },
  interval: {
    type: Number,
    default: 50,
  },
  doubleDigits: {
    type: Boolean,
    default: true,
  },
})

const DEFAULT_REMAINING_TIME = {
  totalMilliseconds: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
  ended: false,
}

const emit = defineEmits(['countdown:ended'])

const remainingTime = ref<RemainingTime>(DEFAULT_REMAINING_TIME)

onMounted(() => {
  const intervalId = setInterval(() => {
    remainingTime.value = calculateRemainingTime(props.target)
    if (remainingTime.value.ended) {
      clearInterval(intervalId)
      remainingTime.value = DEFAULT_REMAINING_TIME
      emit('countdown:ended')
    }
  }, props.interval)

  onBeforeUnmount(() => {
    clearInterval(intervalId)
  })
})
</script>

<template>
  <div class="easy-countdown-component">
    <slot
      :days="zeroPad(remainingTime.days)"
      :hours="zeroPad(remainingTime.hours)"
      :minutes="zeroPad(remainingTime.minutes)"
      :seconds="zeroPad(remainingTime.seconds)"
      :milliseconds="zeroPad(remainingTime.milliseconds)"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Countdown',
}
</script>
