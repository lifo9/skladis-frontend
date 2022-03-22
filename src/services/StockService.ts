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

export function stockIn({ productId, roomId, expiration, quantity }: any = {}) {
  const params = {
    product_id: productId,
    room_id: roomId,
    expiration: expiration,
    quantity: quantity
  }

  return crud.createRecord(params, false, false, 'in')
}

export function stockOut({ productId, roomId, expiration, quantity }: any = {}) {
  const params = {
    product_id: productId,
    room_id: roomId,
    expiration: expiration,
    quantity: quantity
  }

  return crud.createRecord(params, false, false, 'out')
}

export function getExpirationRange() {
  return crud.getRecords(undefined, undefined, 'expiration-range')
}
