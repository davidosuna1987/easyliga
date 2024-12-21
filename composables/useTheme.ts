export default function useTheme() {
  const colorMode = useColorMode()

  const isDarkMode = computed(() => colorMode.value === 'dark')
  const isLightMode = computed(() => colorMode.value === 'light')

  return {
    isDarkMode,
    isLightMode,
    colorMode,
    theme: colorMode.value,
  }
}
