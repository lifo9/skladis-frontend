import { securedAxiosInstance } from '@/services/ApiService'
import CrudService from '@/services/CrudService'

const API_PATH = '/invoices'
const API_PATH_ITEMS = '/invoice-items'
const TYPE = 'invoice'
const TYPE_ITEM = 'invoice_item'
const crud = new CrudService(API_PATH, TYPE)
const crudItems = new CrudService(API_PATH_ITEMS, TYPE_ITEM)

export function getInvoice(id) {
  return crud.getRecord(id)
}

export function getInvoices(params) {
  return crud.getRecords(params)
}

export function getInvoicesDateRange() {
  return crud.getRecords(undefined, undefined, 'invoice-date-range')
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

export function updateStockedIn(id) {
  return securedAxiosInstance.patch(`${API_PATH}/${id}/stocked-in`, { stocked_in: true })
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

export function createInvoiceItem({ invoice_id, product_id, supplier_id, quantity, unit_price }: any = {}) {
  const params = {
    invoice_id: invoice_id,
    product_id: product_id,
    supplier_id: supplier_id,
    quantity: quantity,
    unit_price: unit_price
  }

  return crudItems.createRecord(params)
}

export function deleteInvoice(id) {
  return crud.deleteRecord(id)
}

export function deleteInvoiceAttachment(id) {
  return securedAxiosInstance.delete(`${API_PATH}/${id}/invoice-file`)
}
