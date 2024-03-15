export default function useEasyProps() {
  const storage = useEasyStorage()

  const get = (key: string, removeAfterGet: boolean = true) => {
    const props = storage.get(`props:${key}`)
    removeAfterGet && remove(key)
    return props ?? undefined
  }

  const set = (key: string, value: any) => {
    storage.set(`props:${key}`, value)
  }

  const remove = (key: string) => {
    storage.remove(`props:${key}`)
  }

  return { get, set, remove }
}
