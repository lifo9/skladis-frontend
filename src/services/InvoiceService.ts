import CrudService from '@/services/CrudService'

const API_PATH = '/invoices'
const TYPE = 'invoice'
const crud = new CrudService(API_PATH, TYPE)

export function getInvoice(id) {
  return crud.getRecord(id)
}

export function getInvoices(params) {
  return crud.getRecords(params)
}
