import { plainAxiosInstance, securedAxiosInstance } from '@/services/ApiService'

export const SIGN_IN_URL = '/signin'

export async function signIn(email, password) {
  return plainAxiosInstance.post(SIGN_IN_URL, {
    email: email,
    password: password
  })
}

export async function signOut() {
  return securedAxiosInstance.delete(SIGN_IN_URL)
}

export async function signUp(email, password, passwordConfirmation, firstName, lastName, registrationKey) {
  return plainAxiosInstance.post('/signup', {
    email: email,
    password: password,
    password_confirmation: passwordConfirmation,
    first_name: firstName,
    last_name: lastName,
    registration_key: registrationKey
  })
}

export async function activate(activationKey) {
  return plainAxiosInstance.post('/signup/activate', {
    activation_key: activationKey
  })
}
