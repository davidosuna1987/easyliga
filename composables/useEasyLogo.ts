export default function useEasyLogo(full: boolean = false) {
  const { isLightMode } = useTheme()

  const logoPath = computed(() =>
    full
      ? isLightMode.value
        ? '/logos/easyliga-long.svg'
        : '/logos/easyliga-long-dark.svg'
      : '/logos/easyliga.svg',
  )

  return logoPath
}
