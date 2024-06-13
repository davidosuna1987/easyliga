<script setup lang="ts">
import { LicensableType } from '@/domain/licensable'
import { License } from '@/domain/license'

const props = defineProps({
  type: {
    type: String as PropType<LicensableType | 'all'>,
    required: true,
  },
  licenses: {
    type: Array as PropType<License[]>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'license:create', value: LicensableType | 'all'): void
  (e: 'license:edit', value: License): void
}>()
</script>

<template>
  <div class="easy-license-list-component">
    <header class="header flex justify-between items-center mb-5">
      <Heading tag="h6" position="center">
        {{
          type === 'all'
            ? $t('licenses.all')
            : $t(`licenses.type_long.${type}`, 2)
        }}
      </Heading>
      <Button
        class="action"
        :label="$t('licenses.add')"
        size="small"
        @click.prevent="emit('license:create', type)"
      />
    </header>

    <div class="grid gap-3">
      <template
        v-if="!!licenses.length"
        v-for="license in licenses"
        :key="license.id"
      >
        <LicenseListItem
          :license="license"
          @license:edit="emit('license:edit', license)"
        />
      </template>
      <template v-else-if="type">
        {{
          $t(`licenses.no_licenses_type`, { type: $t(`licenses.type.${type}`) })
        }}
      </template>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LicenseList',
}
</script>
