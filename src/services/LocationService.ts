import CrudService from '@/services/CrudService'

const API_PATH = '/locations'
const TYPE = 'location'
const crud = new CrudService(API_PATH, TYPE)

export function getLocation(id) {
  return crud.getRecord(id)
}

export function getLocations(params) {
  if (params['id']) {
    const roomId = params['id']
    delete params['id']
    params.filters['room_id'] = roomId
  }
  return crud.getRecords(params)
}

export function getLocationOptions(params = undefined) {
  return crud.getOptions(params)
}
export function updateLocation({ id, name, roomId }: any = {}) {
  const params = {
    name: name,
    room_id: roomId
  }

  return crud.updateRecord(id, params)
}

export function createLocation({ name, roomId }: any = {}) {
  const params = {
    name: name,
    room_id: roomId
  }

  return crud.createRecord(params)
}

export function deleteLocation(id) {
  return crud.deleteRecord(id)
}
