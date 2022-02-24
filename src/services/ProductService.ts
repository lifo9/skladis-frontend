import CrudService from '@/services/CrudService'

const API_PATH = '/products'
const TYPE = 'product'
const crud = new CrudService(API_PATH, TYPE)

export function getProduct(id) {
  return crud.getRecord(id)
}

export function getProducts(params) {
  return crud.getRecords(params)
}

export function updateProduct({ id, name, supplierIds }: any = {}) {
  const params = {
    name: name,
    supplier_ids: supplierIds
  }

  return crud.updateRecord(id, params)
}

export function createProdcut({ name, supplierIds }: any = {}) {
  const params = {
    name: name,
    supplier_ids: supplierIds
  }

  return crud.createRecord(params)
}

export function deleteProduct(id) {
  return crud.deleteRecord(id)
}
