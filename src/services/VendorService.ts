import { securedAxiosInstance } from '@/services/ApiService'
import CrudService from '@/services/CrudService'

const API_PATH = '/vendors'
const TYPE = 'vendor'
const crud = new CrudService(API_PATH, TYPE)

export function getVendor(id) {
  return crud.getRecord(id)
}

export function getVendors(params) {
  return crud.getRecords(params)
}

export function updateVendor({ id, name, url, logo } = {}) {
  let params = {
    name: name,
    url: url
  }

  if (logo) {
    params = { ...params, logo: logo }
  }

  return crud.updateRecord(id, params, true)
}

export function createVendor({ name, url, logo } = {}) {
  let params = {
    name: name,
    url: url
  }

  if (logo) {
    params = { ...params, logo: logo }
  }

  return crud.createRecord(params, true)
}

export function deleteVendor(id) {
  return crud.deleteRecord(id)
}

export function deleteLogo(id) {
  return securedAxiosInstance.delete(`${API_PATH}/${id}/logo`)
}
