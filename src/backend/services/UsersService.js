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

export function deleteUser (id) {
  return crud.deleteRecord(id)
}

export function activateUser (id) {
  return securedAxiosInstance.patch(API_PATH + '/' + id + '/activate')
}

export function deactivateUser (id) {
  return securedAxiosInstance.patch(API_PATH + '/' + id + '/deactivate')
}
