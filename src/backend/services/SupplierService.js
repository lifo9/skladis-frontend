import CrudService from './CrudService'

const API_PATH = '/suppliers'
const TYPE = 'supplier'
const crud = new CrudService(API_PATH, TYPE)

export function getSupplier (id) {
  return crud.getRecord(id)
}

export function getSuppliers (params) {
  return crud.getRecords(params)
}

export function updateSupplier ({
  id,
  name,
  ico,
  dic,
  url,
  freeDeliveryFrom,
  streetName,
  streetNumber,
  city,
  zip,
  country,
  coordinates,
  contactId
} = {}) {
  const params = {
    name: name,
    ico: ico,
    dic: dic,
    url: url,
    free_delivery_from: freeDeliveryFrom,
    contact_id: contactId,
    street_name: streetName,
    street_number: streetNumber,
    city: city,
    zip: zip,
    country: country,
    coordinates: coordinates
  }

  return crud.updateRecord(id, params)
}

export function createSupplier ({
  id,
  name,
  ico,
  dic,
  url,
  freeDeliveryFrom,
  streetName,
  streetNumber,
  city,
  zip,
  country,
  coordinates,
  contactId
} = {}) {
  const params = {
    name: name,
    ico: ico,
    dic: dic,
    url: url,
    free_delivery_from: freeDeliveryFrom,
    contact_id: contactId,
    street_name: streetName,
    street_number: streetNumber,
    city: city,
    zip: zip,
    country: country,
    coordinates: coordinates
  }

  return crud.createRecord(params)
}

export function deleteSupplier (id) {
  return crud.deleteRecord(id)
}
