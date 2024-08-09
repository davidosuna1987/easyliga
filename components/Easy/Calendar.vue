<script setup lang="ts">
import { mapIndexToLocaleDateIndex } from '@/domain/utils'
import Calendar from 'primevue/calendar'

const props = defineProps({
  maxWidth: {
    type: String,
    default: '500px',
  },
})

const emit = defineEmits<{
  (e: 'date:changed', value: Date): void
}>()

const { t } = useI18n()

const calendar = ref<InstanceType<typeof Calendar>>()
const today = ref(new Date())
const selectedDate = ref(today.value)
const currentMonth = ref(today.value.getMonth())
const currentYear = ref(today.value.getFullYear())

const getMonday = (date: Date) => {
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  return monday
}

const visibleWeek = computed(() => {
  const startOfWeek = getMonday(selectedDate.value)
  const days = []

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    days.push(day)
  }

  currentMonth.value = selectedDate.value.getMonth()
  currentYear.value = selectedDate.value.getFullYear()

  return days
})

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
  selectDay(new Date(currentYear.value, currentMonth.value, 1))
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
  selectDay(new Date(currentYear.value, currentMonth.value, 1))
}

const prevWeek = () => {
  const newDate = new Date(selectedDate.value)
  newDate.setDate(selectedDate.value.getDate() - 7)

  const newMonday = getMonday(newDate)
  selectDay(newMonday)
}

const nextWeek = () => {
  const newDate = new Date(selectedDate.value)
  newDate.setDate(selectedDate.value.getDate() + 7)

  const newMonday = getMonday(newDate)
  selectDay(newMonday)
}

const selectDay = (day: Date | null) => {
  if (!day) return
  selectedDate.value = day
}

const dayClass = (day: Date | null) => {
  const commonClass =
    'flex flex-col place-self-center gap-2 p-2 w-full rounded-lg cursor-pointer'
  return selectedDate.value.toDateString() === day?.toDateString()
    ? `${commonClass} bg-[var(--highlight-color)] text-white`
    : `${commonClass} hover:bg-[var(--highlight-color-alpha)]`
}

const showCalendar = () => {
  const calendarInput = document.querySelector(
    '.p-calendar input',
  ) as HTMLInputElement
  calendarInput?.click()
}

watch(selectedDate, value => {
  emit('date:changed', value)
})
</script>

<template>
  <EasyGrid class="easy-calendar-component" :style="{ maxWidth }" :gap="1">
    <header class="flex justify-center gap-3 items-center">
      <Button
        class="relative rounded-lg cursor-pointer overflow-hidden p-3 grid place-content-center hover:text-[var(--highlight-color)]"
        unstyled
        @click="prevMonth"
      >
        <EasyIcon name="chevronLeft" />
      </Button>
      <Button
        unstyled
        class="relative rounded-lg p-3 overflow-hidden uppercase font-medium cursor-pointer hover:text-[var(--highlight-color)]"
        @click="showCalendar"
      >
        {{ t(`dates.months.${currentMonth + 1}`) }} {{ currentYear }}
      </Button>
      <Button
        class="relative rounded-lg cursor-pointer overflow-hidden p-3 grid place-content-center hover:text-[var(--highlight-color)]"
        unstyled
        @click="nextMonth"
      >
        <EasyIcon name="chevronRight" />
      </Button>
    </header>

    <EasyGrid class="text-center" :cols="9">
      <Button
        class="cursor-pointer hover:text-[var(--highlight-color)]"
        unstyled
        @click="prevWeek"
      >
        <EasyIcon name="chevronLeft" />
      </Button>
      <div
        v-for="(day, index) in visibleWeek"
        :key="index"
        :class="dayClass(day)"
        @click="selectDay(day)"
      >
        <small class="lowercase">
          {{ t(`dates.weekdays.short.${mapIndexToLocaleDateIndex(index)}`) }}
        </small>
        <span>{{ day.getDate() }}</span>
      </div>
      <Button
        class="cursor-pointer hover:text-[var(--highlight-color)]"
        unstyled
        @click="nextWeek"
      >
        <EasyIcon name="chevronRight" />
      </Button>
    </EasyGrid>

    <Calendar
      ref="calendar"
      v-model="selectedDate"
      class="w-[1px] h-[1px] opacity-0 absolute -top-[9999px] -left-[9999px]"
      touchUI
    />
  </EasyGrid>
</template>

<script lang="ts">
export default {
  name: 'EasyCalendar',
}
</script>
