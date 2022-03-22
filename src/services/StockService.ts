import CrudService from '@/services/CrudService'

const API_PATH = '/stocks'
const TYPE = 'stock'
const crud = new CrudService(API_PATH, TYPE)

export function getStock(id) {
  return crud.getRecord(id)
}

export function getStocks(params) {
  return crud.getRecords(params)
}

export function getExpirationRange() {
  return crud.getRecords(undefined, undefined, 'expiration-range')
}
