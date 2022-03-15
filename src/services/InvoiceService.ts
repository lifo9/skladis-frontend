import { securedAxiosInstance } from '@/services/ApiService'
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

export function updateInvoice({ id, invoiceCode, invoiceDate, invoiceFile, invoiceItems }: any = {}) {
  let params = {
    invoice_code: invoiceCode,
    invoice_date: invoiceDate
  }

  if (invoiceFile) {
    params = { ...params, invoice_file: invoiceFile }
  }

  if (invoiceItems) {
    params = { ...params, invoice_items: invoiceItems }
  }

  return crud.updateRecord(id, params, true)
}

export function createInvoice({ invoiceCode, invoiceDate, invoiceFile, invoiceItems }: any = {}) {
  let params = {
    invoice_code: invoiceCode,
    invoice_date: invoiceDate
  }

  if (invoiceFile) {
    params = { ...params, invoice_file: invoiceFile }
  }

  if (invoiceItems) {
    params = { ...params, invoice_items: invoiceItems }
  }

  return crud.createRecord(params, true)
}

export function deleteInvoice(id) {
  return crud.deleteRecord(id)
}

export function deleteInvoiceAttachment(id) {
  return securedAxiosInstance.delete(`${API_PATH}/${id}/invoice-file`)
}
