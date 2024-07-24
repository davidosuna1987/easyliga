<script setup lang="ts">
import {
  EasyDatepickerDropdownForm,
  EasyDatepickerDropdownType,
} from '@/domain/easy-datepicker-dropdown'

const props = defineProps({
  date: {
    type: Date,
    default: () => new Date(),
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'date:changed', value: Date): void
}>()

const { t } = useI18n()

const selectedDate = ref<Date>(props.date)

const form = ref<EasyDatepickerDropdownForm>({
  day: selectedDate.value.getDate(),
  month: selectedDate.value.getMonth() + 1,
  year: selectedDate.value.getFullYear(),
})

const selectableDays = ref<number[]>([])
const selectableMonths = computed(() => generateSelectableMonths())
const selectableYears = computed(() => generateSelectableYears())

const generateSelectableMonths = () =>
  Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    name: t(`dates.months.${i + 1}`),
  }))

const generateSelectableYears = () =>
  Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

const generateSelectableDays = (month: number, year: number) => {
  const daysInMonth = new Date(year, month, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => i + 1)
}

const updateSelectableDays = () => {
  selectableDays.value = generateSelectableDays(
    form.value.month,
    form.value.year,
  )
  if (form.value.day > selectableDays.value.length) {
    form.value.day = selectableDays.value.length
  }
}

const handleDateChanged = (type: EasyDatepickerDropdownType, value: number) => {
  form.value[type] = value
  if (type === 'month' || type === 'year') {
    updateSelectableDays()
  }
}

watch([() => form.value.month, () => form.value.year], updateSelectableDays, {
  immediate: true,
})

watch(
  form,
  () => {
    const newDate = new Date(
      form.value.year,
      form.value.month - 1,
      form.value.day,
    )
    selectedDate.value = newDate
    emit('date:changed', newDate)
  },
  { deep: true },
)
</script>

<template>
  <nav class="easy-datepicker-dropdown-component flex justify-center">
    <div
      class="flex flex-col md:flex-row justify-center gap-3 w-[200px] md:w-full"
    >
      <Dropdown
        v-model="form.day"
        class="day-dropdown w-full md:w-[100px]"
        :loading="props.loading"
        :options="selectableDays"
        scrollHeight="210px"
        :placeholder="t('dates.select.day')"
        @update:modelValue="handleDateChanged('day', $event)"
      />
      <Dropdown
        v-model="form.month"
        class="month-dropdown w-full md:w-[150px]"
        :loading="props.loading"
        :options="selectableMonths"
        optionValue="value"
        optionLabel="name"
        scrollHeight="210px"
        :placeholder="t('dates.select.month')"
        @update:modelValue="handleDateChanged('month', $event)"
      />
      <Dropdown
        v-model="form.year"
        class="year-dropdown w-full md:w-[100px]"
        :loading="props.loading"
        :options="selectableYears"
        scrollHeight="210px"
        :placeholder="t('dates.select.year')"
        @update:modelValue="handleDateChanged('year', $event)"
      />
    </div>
  </nav>
</template>

<script lang="ts">
export default {
  name: 'EasyDatepickerDropdown',
}
</script>
