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

export function updateProduct({
  id,
  name,
  orderCode,
  barcodeType,
  barcodeCode,
  piecesIdeal,
  piecesCritical,
  supplierIds,
  images
}: any = {}) {
  // eslint-disable-next-line prefer-const
  let params = {
    name: name,
    order_code: orderCode,
    pieces_ideal: piecesIdeal,
    pieces_critical: piecesCritical,
    supplier_ids: supplierIds,
    images: images
  }

  if (barcodeType) {
    params['barcode_type'] = barcodeType
  }

  if (barcodeCode) {
    params['barcode_code'] = barcodeCode
  }

  return crud.updateRecord(id, params, true, true)
}

export function createProdcut({
  name,
  orderCode,
  barcodeType,
  barcodeCode,
  piecesIdeal,
  piecesCritical,
  supplierIds,
  images
}: any = {}) {
  // eslint-disable-next-line prefer-const
  let params = {
    name: name,
    order_code: orderCode,
    pieces_ideal: piecesIdeal,
    pieces_critical: piecesCritical,
    supplier_ids: supplierIds,
    images: images
  }

  if (barcodeType) {
    params['barcode_type'] = barcodeType
  }

  if (barcodeCode) {
    params['barcode_code'] = barcodeCode
  }

  return crud.createRecord(params, true, true)
}

export function deleteProduct(id) {
  return crud.deleteRecord(id)
}
