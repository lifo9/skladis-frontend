export default {
  persist(storeId: string, key: string, value: any) {
    const storeKey = `${storeId}-store`
    const storeContent = loadStoreContent(storeKey)
    const storedObject = { [key]: value }

    localStorage?.setItem(storeKey, JSON.stringify({ ...storeContent, ...storedObject }))
  },

  load(storeId: string, key: string, defaultValue: any = undefined): any {
    const storeKey = `${storeId}-store`
    const storeContent = loadStoreContent(storeKey)

    if (storeContent[key]) {
      return storeContent[key]
    } else {
      defaultValue
    }
  },

  remove(storeId: string, key: string) {
    const storeKey = `${storeId}-store`
    const storeContent = loadStoreContent(storeKey)

    if (storeContent[key]) {
      delete storeContent[key]
      localStorage?.setItem(storeKey, JSON.stringify({ ...storeContent }))
    }
  }
}

function loadStoreContent(storeKey: string): object {
  const content = localStorage?.getItem(storeKey)

  if (content) {
    return JSON.parse(content)
  }

  return {}
}
