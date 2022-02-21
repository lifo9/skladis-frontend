import { securedAxiosInstance } from '@/services/ApiService'
import CrudService from '@/services/CrudService'

const API_PATH = '/my-profile'
const TYPE = 'user'
const crud = new CrudService(API_PATH, TYPE)

export async function getMyProfile() {
  return securedAxiosInstance.get(API_PATH)
}

export function updateMyProfile({ firstName, lastName, email, phone, password, avatar } = {}) {
  let params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone
  }

  if (avatar) {
    params = { ...params, avatar: avatar }
  }

  if (password) {
    params = { ...params, password: password }
  }

  return crud.updateRecord(null, params, true)
}

export function deleteAvatar() {
  return securedAxiosInstance.delete(API_PATH + '/avatar')
}
