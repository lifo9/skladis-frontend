import CrudService from './CrudService'
import { securedAxiosInstance } from './ApiService'

const API_PATH = '/users'
const crud = new CrudService(API_PATH, 'user')

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
  password
} = {}) {
  const params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone,
    active: active,
    role_ids: roles,
    password: password
  }

  return crud.updateRecord(id, params)
}

export function createUser ({
  firstName,
  lastName,
  email,
  phone,
  active,
  roles,
  password
} = {}) {
  const params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone,
    active: active,
    role_ids: roles,
    password: password
  }
  return crud.createRecord(params)
}

export function deleteUser (id) {
  return crud.deleteRecord(id)
}

export function activateUser (id) {
  return securedAxiosInstance.post(API_PATH + '/' + id + '/activation')
}

export function deactivateUser (id) {
  return securedAxiosInstance.delete(API_PATH + '/' + id + '/activation')
}
