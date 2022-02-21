import CrudService from '@/services/CrudService'

const crud = new CrudService('/roles', 'role')

export function getRoles(params) {
  return crud.getRecords(params)
}
