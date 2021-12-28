import { securedAxiosInstance } from './ApiService'

export const CONTACTS_URL = '/contacts'

export function getContacts (page = null, searchQuery = null) {
  let params = {}
  if (page) {
    params.page = page
  }
  if (searchQuery) {
    params.search = searchQuery
  }

  return securedAxiosInstance.get(CONTACTS_URL, { params: params })
}
