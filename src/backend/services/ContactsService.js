import CrudService from './CrudService'

const crud = new CrudService('/contacts', 'contact')

export function getContact (id) {
  return crud.getRecord(id)
}

export function getContacts (params) {
  return crud.getRecords(params)
}

export function updateContact ({ id, firstName, lastName, email, phone } = {}) {
  const params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone
  }

  return crud.updateRecord(id, params)
}

export function createContact ({ firstName, lastName, email, phone } = {}) {
  const params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone
  }
  return crud.createRecord(params)
}

export function deleteContact (id) {
  return crud.deleteRecord(id)
}
