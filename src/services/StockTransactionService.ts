import CrudService from '@/services/CrudService'

const API_PATH = '/stock-transactions'
const TYPE = 'stock-transaction'
const crud = new CrudService(API_PATH, TYPE)

export function getStockTransaction(id) {
  return crud.getRecord(id)
}

export function getStockTransactions(params) {
  return crud.getRecords(params)
}

export function getCreatedAtRange() {
  return crud.getRecords(undefined, undefined, 'created-at-range')
}
