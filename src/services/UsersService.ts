import { securedAxiosInstance } from '@/services/ApiService'
import CrudService from '@/services/CrudService'

const API_PATH = '/users'
const TYPE = 'user'
const crud = new CrudService(API_PATH, TYPE)

export function getUser(id) {
  return crud.getRecord(id)
}

export function getUsers(params) {
  return crud.getRecords(params)
}

export function updateUser({ id, firstName, lastName, email, phone, active, roles, password, avatar } = {}) {
  let params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone,
    active: active,
    role_ids: roles
  }

  if (avatar) {
    params = { ...params, avatar: avatar }
  }

  if (password) {
    params = { ...params, password: password }
  }

  return crud.updateRecord(id, params, true)
}

export function createUser({ firstName, lastName, email, phone, active, roles, password, avatar } = {}) {
  let params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone,
    active: active,
    role_ids: roles,
    password: password
  }

  if (avatar) {
    params = { ...params, avatar: avatar }
  }

  return crud.createRecord(params, true)
}

export function deleteUser(id) {
  return crud.deleteRecord(id)
}

export function deleteAvatar(id) {
  return securedAxiosInstance.delete(`${API_PATH}/${id}/avatar`)
}

export function activateUser(id) {
  return securedAxiosInstance.post(API_PATH + '/' + id + '/activation')
}

export function deactivateUser(id) {
  return securedAxiosInstance.delete(API_PATH + '/' + id + '/activation')
}
