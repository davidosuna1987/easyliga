export default function useEasyProps() {
  const storage = useEasyStorage()

  const get = (key: string) => {
    const props = storage.get(`props:${key}`)
    remove(key)
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
