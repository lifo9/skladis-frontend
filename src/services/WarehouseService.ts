import CrudService from '@/services/CrudService'

const API_PATH = '/warehouses'
const TYPE = 'warehouse'
const crud = new CrudService(API_PATH, TYPE)

export function getWarehouse(id) {
  return crud.getRecord(id)
}

export function getWarehouses(params) {
  return crud.getRecords(params)
}

export function getWarehouseOptions() {
  return crud.getOptions()
}

export function updateWarehouse({
  id,
  name,
  addressId,
  streetName,
  streetNumber,
  city,
  zip,
  country,
  coordinates
}: any = {}) {
  const params = {
    name: name,
    address_attributes: {
      id: addressId,
      street_name: streetName,
      street_number: streetNumber,
      city: city,
      zip: zip,
      country: country,
      coordinates: coordinates && coordinates.length > 0 ? coordinates : null
    }
  }

  return crud.updateRecord(id, params)
}

export function createWarehouse({
  name,
  addressId,
  streetName,
  streetNumber,
  city,
  zip,
  country,
  coordinates
}: any = {}) {
  const params = {
    name: name,
    address_attributes: {
      id: addressId,
      street_name: streetName,
      street_number: streetNumber,
      city: city,
      zip: zip,
      country: country,
      coordinates: coordinates && coordinates.length > 0 ? coordinates : null
    }
  }

  return crud.createRecord(params)
}

export function deleteWarehouse(id) {
  return crud.deleteRecord(id)
}
