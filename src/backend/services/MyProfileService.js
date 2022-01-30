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
  password,
  avatar
} = {}) {
  let formData = new FormData()
  const params = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone,
    password: password
  }

  if (avatar) {
    formData.append(`${TYPE}[avatar]`, avatar)
  }
  for (const key in params) {
    if (params[key]) {
      formData.append(`${TYPE}[${key}]`, params[key])
    }
  }

  return securedAxiosInstance.patch(API_PATH, formData)
}

export function deleteAvatar () {
  return securedAxiosInstance.delete(API_PATH + '/avatar')
}
