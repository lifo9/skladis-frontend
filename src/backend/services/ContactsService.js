import { securedAxiosInstance } from './ApiService'

export const CONTACTS_URL = '/contacts'

export function getContacts ({ page, perPage, searchQuery } = {}) {
  let params = {}
  if (page) {
    params.page = page
  }
  if (searchQuery) {
    params.search = searchQuery
  }
  if (perPage) {
    params.per_page = perPage
  }

  return securedAxiosInstance.get(CONTACTS_URL, { params: params })
}
