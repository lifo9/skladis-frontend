import CrudService from './CrudService'

const API_PATH = '/warehouses'
const TYPE = 'warehouse'
const crud = new CrudService(API_PATH, TYPE)

export function getWarehouse (id) {
  return crud.getRecord(id)
}

export function getWarehouses (params) {
  return crud.getRecords(params)
}

export function updateWarehouse ({
  id,
  name,
  streetName,
  streetNumber,
  city,
  zip,
  country,
  coordinates
} = {}) {
  const params = {
    name: name,
    street_name: streetName,
    street_number: streetNumber,
    city: city,
    zip: zip,
    country: country,
    coordinates: coordinates
  }

  return crud.updateRecord(id, params)
}

export function createWarehouse ({
  name,
  streetName,
  streetNumber,
  city,
  zip,
  country,
  coordinates
} = {}) {
  const params = {
    name: name,
    street_name: streetName,
    street_number: streetNumber,
    city: city,
    zip: zip,
    country: country,
    coordinates: coordinates
  }

  return crud.createRecord(params)
}

export function deleteWarehouse (id) {
  return crud.deleteRecord(id)
}
