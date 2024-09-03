<script setup lang="ts">
import { Set } from '@/domain/set'
import { Call } from '@/domain/call'

definePageMeta({
  middleware: ['role'],
  roles: ['coach'],
})

const { t } = useI18n()

const set = ref<Set>()
const call = ref<Call>()

const handleSetUpdated = (updatedSet: Set) => {
  set.value = updatedSet
}

const handleCallUpdated = (updatedCall: Call | undefined) => {
  call.value = updatedCall
}
</script>

<template>
  <NuxtLayout name="default">
    <Heading tag="h3" position="center" class="mb-5">
      {{ call?.team?.name }}
    </Heading>
    <Heading tag="h4" position="center" v-highlight="call?.team?.name">
      {{ t('rotations.assign_set_rotation', { num: set?.number }) }}
    </Heading>

    <CoachRotationForm
      initialRotation
      @update:set="handleSetUpdated"
      @update:call="handleCallUpdated"
    />
  </NuxtLayout>
</template>
