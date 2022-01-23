import CrudService from './CrudService'

const crud = new CrudService('/roles', 'role')

export function getRoles (params) {
  return crud.getRecords(params)
}
