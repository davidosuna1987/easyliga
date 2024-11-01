<script setup lang="ts">
import { EmailTemplate, EmailTemplateVariables, toHtml } from '@/domain/email'

const props = defineProps({
  template: {
    type: Object as PropType<EmailTemplate>,
    required: false,
  },
  variables: {
    type: Array as PropType<EmailTemplateVariables[]>,
    required: false,
  },
  destinataries: {
    type: Array as PropType<string[]>,
    required: false,
  },
  subject: {
    type: String,
    required: false,
  },
  greeting: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: false,
  },
  actionUrl: {
    type: String,
    required: false,
  },
  actionText: {
    type: String,
    required: false,
  },
  attachments: {
    type: Array as PropType<string[]>,
    required: false,
  },
  showInfo: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()

const previewDestinataries = computed(() => {
  if (props.destinataries) return props.destinataries

  const destinatary = props.template?.variables?.find(
    o => o.key === 'destinatary',
  )?.value as string

  if (destinatary) return [destinatary]

  const destinataries = props.template?.variables?.find(
    o => o.key === 'destinataries',
  )?.value as string[]

  return destinataries
})

const previewSubject = computed(() =>
  props.subject
    ? props.subject
    : (props.template?.variables?.find(o => o.key === 'subject')
        ?.value as string),
)

const previewGreeting = computed(() =>
  props.greeting
    ? props.greeting
    : props.template?.greeting
    ? props.template.greeting
    : (props.template?.variables?.find(o => o.key === 'greeting')
        ?.value as string),
)

const previewAttachments = computed(() =>
  props.attachments
    ? props.attachments
    : props.template?.attachments
    ? (props.template.attachments as string[])
    : (props.template?.variables?.find(o => o.key === 'attachments')
        ?.value as string[]),
)

const templateMessageHtml = computed(() => {
  const message = props.message ?? props.template?.message
  const variables = props.variables ?? props.template?.variables
  return message ? toHtml(message, variables) : undefined
})
</script>

<template>
  <section class="easy-email-preview-component relative">
    <aside v-if="props.showInfo" class="info">
      <p><strong>From:</strong> EasyLiga &lt;info.easyliga@gmail.com&gt;</p>
      <p v-if="previewDestinataries?.length">
        <strong>To:</strong> &lt;{{
          previewDestinataries.joinReplaceLast(', ', ` ${t('forms.and')} `)
        }}&gt;
      </p>
      <p v-if="previewSubject">
        <strong>Subject:</strong> {{ previewSubject }} — EasyLiga
      </p>
    </aside>
    <table class="mx-auto bg-[var(--foreground-color)] w-full">
      <tbody>
        <tr>
          <td style="height: 80px">&nbsp;</td>
        </tr>
        <tr>
          <td>
            <a
              class="flex justify-center items-center gap-5"
              href=""
              title="EasyLiga logo"
            >
              <IconEasyLigaFull size="50px" />
              <!-- <span
                class="font-extrabold text-4xl [color:var(--text-color)_!important]"
              >
                EasyLiga
              </span> -->
            </a>
          </td>
        </tr>
        <tr>
          <td style="height: 20px">&nbsp;</td>
        </tr>
        <tr>
          <td>
            <table
              class="bg-[var(--background-color)] shadow-1 mx-auto"
              style="max-width: 670px; width: 90%; border-radius: 1rem"
            >
              <tbody>
                <tr>
                  <td style="height: 40px">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding: 0 35px">
                    <h3 class="font-serif mb-5">{{ previewGreeting }}</h3>

                    <div v-html="templateMessageHtml"></div>

                    <div
                      v-if="actionUrl && actionText"
                      class="flex justify-center items-center"
                    >
                      <a
                        :href="actionUrl"
                        target="_blank"
                        class="easy-button-link"
                      >
                        {{ actionText }}
                      </a>
                    </div>

                    <br /><br />
                    <h5 class="font-serif text-center">
                      {{ t('email_templates.sincerely') }}
                    </h5>
                    <p class="flex justify-center items-center gap-2">
                      <IconEasyLiga size="16" />
                      EasyLiga
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="height: 60px">&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td style="height: 20px">&nbsp;</td>
        </tr>
        <tr>
          <td class="text-center block">
            <a href="" class="fw-500 text-[var(--text-color)_!important]">
              © https://easyliga.com
            </a>
          </td>
        </tr>
        <tr>
          <td style="height: 80px">&nbsp;</td>
        </tr>
      </tbody>
    </table>
    <aside
      v-if="props.showInfo && props.attachments?.length"
      class="info bottom-0"
    >
      <p><strong>Attachments:</strong></p>
      <ul class="list-disc pl-4 mt-2">
        <li v-for="attachment in previewAttachments">{{ attachment }}</li>
      </ul>
    </aside>
  </section>
</template>

<style scoped lang="scss">
.easy-email-preview-component {
  border-radius: 1.5rem;
  overflow: hidden;

  .info {
    position: absolute;
    z-index: 1;
    padding: 1rem 1.5rem;
    font-size: 0.85rem;
    color: var(--text-color);
  }

  .easy-button-link {
    background: var(--primary-color);
    text-decoration: none !important;
    font-weight: 500;
    margin-top: 35px;
    color: var(--primary-color-text) !important;
    text-transform: uppercase;
    font-size: 14px;
    padding: 10px 24px;
    display: inline-block;
    border-radius: 50px;
  }
  .easy-button-link:hover {
    text-decoration: none !important;
  }
}
</style>
