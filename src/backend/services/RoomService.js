import CrudService from './CrudService'

const API_PATH = '/rooms'
const TYPE = 'room'
const crud = new CrudService(API_PATH, TYPE)

export function getRoom (id) {
  return crud.getRecord(id)
}

export function getRooms (params) {
  return crud.getRecords(params)
}

export function updateRoom ({ id, name, warehouseId } = {}) {
  const params = {
    name: name,
    warehouse_id: warehouseId
  }

  return crud.updateRecord(id, params)
}

export function createRoom ({ name, warehouseId } = {}) {
  const params = {
    name: name,
    warehouse_id: warehouseId
  }

  return crud.createRecord(params)
}

export function deleteRoom (id) {
  return crud.deleteRecord(id)
}
