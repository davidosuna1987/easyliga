export default defineNuxtPlugin(nuxtApp => {
  // array
  Array.prototype.joinReplaceLast = function (
    separator: string,
    lastSeparator?: string,
  ): string {
    const joined = this.join(separator)

    return lastSeparator
      ? joined.replace(
          new RegExp(`${separator}([^${separator}]*)$`),
          `${lastSeparator}$1`,
        )
      : joined
  }
})
