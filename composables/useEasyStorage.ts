export default function useEasyStorage() {
  const get = (key: string) => {
    const value = localStorage.getItem(key)

    if (value) {
      return JSON.parse(value)
    }

    return null
  }

  const getNested = (
    fullKey: string,
    defaultResponse = [],
    removeNulls = true,
  ) => {
    const keys = fullKey.split('.')
    let currentValue = get(keys[0])

    for (let i = 1; i < keys.length; i++) {
      if (currentValue && typeof currentValue === 'object') {
        currentValue = currentValue[keys[i]]

        // Si es un array y no es el último elemento de la clave
        if (Array.isArray(currentValue) && i < keys.length - 1) {
          // Continuar con el siguiente elemento del array
          const id = keys[i + 1]
          currentValue = currentValue.map((item: any) => item[id])
          // Romper el bucle ya que se realizó el mapeo
          break
        }
      } else {
        return null
      }
    }

    // Filtrar y eliminar los valores null del resultado
    if (removeNulls && Array.isArray(currentValue)) {
      currentValue = currentValue.filter(
        item => item !== null && item !== undefined,
      )
    }

    return currentValue ?? defaultResponse
  }

  const set = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
  }

  const remove = (key: string) => {
    localStorage.removeItem(key)
  }

  return { get, getNested, set, remove }
}
