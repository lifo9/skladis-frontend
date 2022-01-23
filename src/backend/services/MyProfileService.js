import { securedAxiosInstance } from './ApiService'

const API_PATH = '/my-profile'
const TYPE = 'user'

export async function getMyProfile () {
  return securedAxiosInstance.get(API_PATH)
}

export function updateMyProfile ({
  firstName,
  lastName,
  email,
  phone,
  password
} = {}) {
  const params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone,
    password: password
  }
  let payload = {}
  payload[TYPE] = params

  return securedAxiosInstance.patch(API_PATH, payload)
}
