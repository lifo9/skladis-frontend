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

export function stockIn({ productId, roomId, locationId, expiration, quantity }: any = {}) {
  const params = {
    product_id: productId,
    room_id: roomId,
    location_id: locationId,
    expiration: expiration,
    quantity: quantity
  }

  return crud.createRecord(params, false, false, 'in')
}

export function stockOut({ productId, roomId, locationId, expiration, quantity }: any = {}) {
  const params = {
    product_id: productId,
    room_id: roomId,
    location_id: locationId,
    expiration: expiration,
    quantity: quantity
  }

  return crud.createRecord(params, false, false, 'out')
}

export function stockTransfer({
  productId,
  roomFromId,
  locationFromId,
  roomToId,
  locationToId,
  expiration,
  quantity
}: any = {}) {
  const params = {
    product_id: productId,
    room_from_id: roomFromId,
    room_to_id: roomToId,
    location_from_id: locationFromId,
    location_to_id: locationToId,
    expiration: expiration,
    quantity: quantity
  }

  return crud.createRecord(params, false, false, 'transfer')
}

export function getExpirationRange() {
  return crud.getRecords(undefined, undefined, 'expiration-range')
}
