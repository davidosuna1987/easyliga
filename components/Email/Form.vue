<script setup lang="ts">
import EmailService from '@/services/email'
import { EMAIL_DEFAULT_DATA, EmailCustomRequest } from '@/domain/email'

const { t } = useI18n()
const toast = useEasyToast()

const emailService = new EmailService()

const loadingApi = ref<boolean>(false)
const form = ref<EmailCustomRequest>(EMAIL_DEFAULT_DATA)

const errors = ref<Record<string, string | undefined>>({
  destinataries: undefined,
  attachments: undefined,
  subject: undefined,
  message: undefined,
})

const previewDestinatary = computed(() => form.value.destinataries?.[0])

const setErrors = () => {
  removeErrors()
  if (!form.value.destinataries.length)
    errors.value.destinataries = t('errors.required_field')
  if (!form.value.subject) errors.value.subject = t('errors.required_field')
  if (!form.value.message) errors.value.message = t('errors.required_field')
}

const removeErrors = () => {
  errors.value = {
    destinatary: undefined,
    destinataries: undefined,
    attachments: undefined,
    subject: undefined,
    message: undefined,
  }
}

const clearForm = () => (form.value = EMAIL_DEFAULT_DATA)

const clearDestinatary = () => {
  form.value.destinataries = EMAIL_DEFAULT_DATA.destinataries
  form.value.greeting = EMAIL_DEFAULT_DATA.greeting
}

const submit = () => {
  setErrors()

  if (Object.values(errors.value).some(o => !!o)) {
    toast.error(t('errors.correct_before_proceed'))
    return
  }

  handleSubmit()
}

const handleSubmit = async () => {
  loadingApi.value = true

  const { data, error } = await emailService.custom(form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    toast.success(t('emails.submitted'))
    clearDestinatary()
  }

  loadingApi.value = false
}

watch(
  form,
  () => {
    removeErrors()
  },
  { deep: true },
)
</script>

<template>
  <div class="easy-email-form-component grid grid-cols-12 gap-5">
    <div class="col-span-12 md:col-span-5 lg:col-span-4">
      <form @submit.prevent="submit">
        <FormLabel
          :label="t('emails.destinatary', 2)"
          :error="errors.destinataries"
          required
        />
        <Chips
          v-model="form.destinataries"
          class="w-full mb-3"
          inputClass="w-full"
          :disabled="loadingApi"
          separator=","
          :allowDuplicate="false"
          :addOnBlur="true"
        />

        <FormLabel
          :label="t('emails.subject')"
          :error="errors.subject"
          required
        />
        <InputText
          v-model="form.subject"
          class="w-full mb-3"
          :disabled="loadingApi"
        />

        <FormLabel
          :label="t('emails.greeting')"
          :error="errors.greeting"
          required
        />
        <InputText
          v-model="form.greeting"
          class="w-full mb-3"
          :disabled="loadingApi"
        />

        <FormLabel
          :label="t('forms.message')"
          :error="errors.message"
          required
        />
        <Editor
          v-model="form.message"
          :class="['mb-3', { 'is-muted': loadingApi }]"
          editorStyle="height: 150px"
        >
          <template v-slot:toolbar>
            <span class="ql-formats">
              <button class="ql-bold" v-tooltip.bottom="t('editor.bold')" />
              <button class="ql-italic" v-tooltip.bottom="t('editor.italic')" />
              <button
                class="ql-underline"
                v-tooltip.bottom="t('editor.underlined')"
              />
              <button class="ql-strike" v-tooltip.bottom="t('editor.strike')" />
            </span>
            <span class="ql-formats">
              <button
                class="ql-list"
                value="ordered"
                v-tooltip.bottom="t('editor.list_ordered')"
              />
              <!-- <button
                class="ql-list"
                value="bullet"
                v-tooltip.bottom="t('editor.list_unordered')"
              /> -->
            </span>
            <span class="ql-formats">
              <button class="ql-link" v-tooltip.bottom="t('editor.link')" />
            </span>
          </template>
        </Editor>

        <FormLabel :label="t('emails.action_url')" />
        <InputText
          v-model="form.actionUrl"
          class="w-full mb-3"
          :disabled="loadingApi"
        />

        <FormLabel :label="t('emails.action_text')" />
        <InputText
          v-model="form.actionText"
          class="w-full mb-3"
          :disabled="loadingApi"
        />

        <FormLabel
          :label="t('attachments.attachment', 2)"
          :error="errors.attachments"
        />
        <Chips
          v-model="form.attachments"
          class="w-full mb-3"
          :disabled="loadingApi"
          separator=","
          :allowDuplicate="false"
          :addOnBlur="true"
        />

        <footer class="be-email-form__footer flex justify-content-end">
          <Button
            type="submit"
            class="px-6"
            @click.prevent="submit"
            :loading="loadingApi"
            :disabled="loadingApi"
          >
            {{ t('forms.submit') }}
          </Button>
        </footer>
      </form>
    </div>
    <div class="col-span-12 md:col-span-7 lg:col-span-8">
      <EmailPreview
        :destinataries="form.destinataries"
        :subject="form.subject"
        :greeting="form.greeting"
        :message="form.message"
        :actionUrl="form.actionUrl"
        :actionText="form.actionText"
        :attachments="form.attachments"
        showInfo
      />
    </div>
  </div>
</template>
