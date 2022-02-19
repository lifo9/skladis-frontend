export default {
  persist(key: string, value: any) {
    localStorage?.setItem(key, JSON.stringify(value))
  },

  load(key: string, defaultValue = undefined): any {
    const value = localStorage?.getItem(key)
    if (value) {
      return JSON.parse(value)
    } else {
      defaultValue
    }
  },

  remove(key: string) {
    localStorage?.removeItem(key)
  }
}
