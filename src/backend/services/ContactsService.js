import { securedAxiosInstance } from './ApiService'

export const CONTACTS_URL = '/contacts'

export function getContact (id) {
  return securedAxiosInstance.get(CONTACTS_URL + '/' + id)
}

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

export function updateContact ({ id, firstName, lastName, email, phone } = {}) {
  const params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone
  }
  return securedAxiosInstance.patch(CONTACTS_URL + '/' + id, {
    contact: params
  })
}

export function createContact ({ firstName, lastName, email, phone } = {}) {
  const params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone
  }
  return securedAxiosInstance.post(CONTACTS_URL, { contact: params })
}

export function deleteContact (id) {
  return securedAxiosInstance.delete(CONTACTS_URL + '/' + id)
}
