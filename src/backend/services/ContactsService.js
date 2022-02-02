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
  let params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone
  }

  if (avatar) {
    params = { ...params, avatar: avatar }
  }

  return crud.updateRecord(id, params, true)
}

export function createContact ({
  firstName,
  lastName,
  email,
  phone,
  avatar
} = {}) {
  let params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone,
    avatar: avatar
  }

  if (avatar) {
    params = { ...params, avatar: avatar }
  }

  return crud.createRecord(params, true)
}

export function deleteContact (id) {
  return crud.deleteRecord(id)
}

export function deleteAvatar (id) {
  return securedAxiosInstance.delete(`${API_PATH}/${id}/avatar`)
}
