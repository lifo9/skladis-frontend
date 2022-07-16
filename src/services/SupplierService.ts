import CrudService from '@/services/CrudService'

const API_PATH = '/suppliers'
const TYPE = 'supplier'
const crud = new CrudService(API_PATH, TYPE)

export function getSupplier(id) {
  return crud.getRecord(id)
}

export function getSuppliers(params) {
  return crud.getRecords(params)
}

export function getSupplierOptions(params) {
  return crud.getOptions(params)
}

export function updateSupplier({
  id,
  name,
  ico,
  dic,
  ic_dph,
  url,
  freeDeliveryFrom,
  streetName,
  streetNumber,
  city,
  zip,
  country,
  coordinates,
  contactId,
  addressId
}: any = {}) {
  const params = {
    name: name,
    ico: ico,
    dic: dic,
    ic_dph: ic_dph,
    url: url,
    free_delivery_from: freeDeliveryFrom,
    contact_id: contactId,
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

export function createSupplier({
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
  contactId,
  addressId
}: any = {}) {
  const params = {
    name: name,
    ico: ico,
    dic: dic,
    url: url,
    free_delivery_from: freeDeliveryFrom,
    contact_id: contactId,
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

export function deleteSupplier(id) {
  return crud.deleteRecord(id)
}
