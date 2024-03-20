import VueSignaturePad from 'vue-signature-pad'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(VueSignaturePad)
})
