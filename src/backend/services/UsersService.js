import CrudService from './CrudService'
import { securedAxiosInstance } from './ApiService'

const API_PATH = '/users'
const TYPE = 'user'
const crud = new CrudService(API_PATH, TYPE)

export function getUser (id) {
  return crud.getRecord(id)
}

export function getUsers (params) {
  return crud.getRecords(params)
}

export function updateUser ({
  id,
  firstName,
  lastName,
  email,
  phone,
  active,
  roles,
  password,
  avatar
} = {}) {
  let formData = new FormData()
  const params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone,
    active: active,
    role_ids: roles,
    password: password
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

export function createUser ({
  firstName,
  lastName,
  email,
  phone,
  active,
  roles,
  password,
  avatar
} = {}) {
  let formData = new FormData()
  const params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone,
    active: active,
    role_ids: roles,
    password: password
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

export function deleteUser (id) {
  return crud.deleteRecord(id)
}

export function deleteAvatar (id) {
  return securedAxiosInstance.delete(`${API_PATH}/${id}/avatar`)
}

export function activateUser (id) {
  return securedAxiosInstance.post(API_PATH + '/' + id + '/activation')
}

export function deactivateUser (id) {
  return securedAxiosInstance.delete(API_PATH + '/' + id + '/activation')
}
