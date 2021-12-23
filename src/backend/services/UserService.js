import { plainAxiosInstance, securedAxiosInstance } from './ApiService'

export async function getCurrentUser () {
  return securedAxiosInstance.get('/me')
}

export async function signIn (email, password) {
  return plainAxiosInstance.post('/signin', {
    email: email,
    password: password
  })
}

export async function signOut () {
  return securedAxiosInstance.delete('/signin')
}

export async function signUp (
  email,
  password,
  passwordConfirmation,
  firstName,
  lastName,
  registrationKey
) {
  return plainAxiosInstance.post('/signup', {
    email: email,
    password: password,
    password_confirmation: passwordConfirmation,
    first_name: firstName,
    last_name: lastName,
    registration_key: registrationKey
  })
}

export async function activate (activationKey) {
  return plainAxiosInstance.post('/signup/activate', {
    activation_key: activationKey
  })
}
