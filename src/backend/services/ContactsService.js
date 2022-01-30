import CrudService from './CrudService'
import { securedAxiosInstance } from './ApiService'

const API_PATH = '/contacts'
const TYPE = 'contact'
const crud = new CrudService(API_PATH, TYPE)

export function getContact (id) {
  return crud.getRecord(id)
}

export function getContacts (params) {
  return crud.getRecords(params)
}

export function updateContact ({
  id,
  firstName,
  lastName,
  email,
  phone,
  avatar
} = {}) {
  let formData = new FormData()
  const params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone
  }

  if (avatar) {
    formData.append(`${TYPE}[avatar]`, avatar)
  }
  for (const key in params) {
    if (params[key]) {
      formData.append(`${TYPE}[${key}]`, params[key])
    }
  }

  return crud.updateRecord(id, formData, true)
}

export function createContact ({
  firstName,
  lastName,
  email,
  phone,
  avatar
} = {}) {
  let formData = new FormData()
  const params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone
  }

  if (avatar) {
    formData.append(`${TYPE}[avatar]`, avatar)
  }
  for (const key in params) {
    if (params[key]) {
      formData.append(`${TYPE}[${key}]`, params[key])
    }
  }

  return crud.createRecord(formData, true)
}

export function deleteContact (id) {
  return crud.deleteRecord(id)
}

export function deleteAvatar (id) {
  return securedAxiosInstance.delete(`${API_PATH}/${id}/avatar`)
}
