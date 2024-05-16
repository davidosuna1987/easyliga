import { useAuthStore } from '@/stores/useAuthStore'

export default defineNuxtPlugin(nuxtApp => {
  const easyStorage = useEasyStorage()

  const commentNode = (el: HTMLElement, binding: any, vnode: any) => {
    const comment = document.createComment(' ' + binding.value + ' ')
    Object.defineProperty(comment, 'setAttribute', {
      value: () => undefined,
    })
    vnode.el = comment
    vnode.text = ' ' + binding.value + ' '
    vnode.isComment = true
    vnode.context = undefined
    vnode.tag = undefined
    vnode.dirs = undefined

    if (vnode.componentInstance) {
      vnode.componentInstance.$el = comment
    }
    if (el.parentNode) {
      el.parentNode.replaceChild(comment, el)
    }
  }

  nuxtApp.vueApp.directive('role', (el, binding, vnode) => {
    const storedRoles = easyStorage.getNested('auth.roles') || []
    if (storedRoles.includes('admin')) return

    const roles = Array.isArray(binding.value)
      ? binding.value
      : binding.value.split(',')
    const hasRole = roles.some((r: string) => storedRoles.includes(r))

    if (!hasRole) commentNode(el, binding, vnode)
  })

  nuxtApp.vueApp.directive('roles', (el, binding, vnode) => {
    const storedRoles = easyStorage.getNested('auth.roles') || []
    if (storedRoles.includes('admin')) return

    const roles = binding.value.split(',')
    const hasRoles = roles.every((r: string) => storedRoles.includes(r))

    if (!hasRoles) commentNode(el, binding, vnode)
  })
})
