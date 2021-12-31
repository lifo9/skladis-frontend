import CrudService from './CrudService'

const crud = new CrudService('/users', 'user')

export function getUser (id) {
  return crud.getRecord(id)
}

export function getUsers (params) {
  return crud.getRecords(params)
}

export function deleteUser (id) {
  return crud.deleteRecord(id)
}
