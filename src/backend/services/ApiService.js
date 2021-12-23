import axios from 'axios'
import { store } from '../store/store'
import { getVueLocale } from './LanguageService'

const API_URL = process.env.ROOT_API
const appLocale = getVueLocale()

// HELPERS

// for multiple parallel requests
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// AXIOS INSTANCES
const securedAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Locale: appLocale
  }
})

const plainAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Locale: appLocale
  }
})

securedAxiosInstance.interceptors.request.use(config => {
  const method = config.method.toUpperCase()
  if (method !== 'OPTIONS' && method !== 'GET') {
    config.headers = {
      ...config.headers,
      'X-CSRF-TOKEN': store.state.csrf
    }
  }
  return config
})

securedAxiosInstance.interceptors.response.use(null, async error => {
  if (
    store.state.signedIn &&
    error.response &&
    error.response.config &&
    !error.config._retry &&
    (error.response.status === 401 || error.response.status === 403)
  ) {
    const originalRequest = error.config
    const refreshToken = store.state.csrf

    if (isRefreshing) {
      try {
        const csrf = await new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
        originalRequest.headers['X-CSRF-TOKEN'] = csrf
        return await axios(originalRequest)
      } catch (err) {
        return Promise.reject(err)
      }
    }

    originalRequest._retry = true
    isRefreshing = true

    return new Promise(function (resolve, reject) {
      // In case 401/403 is caused by expired access cookie - we'll do refresh request
      plainAxiosInstance
        .post('/refresh', {}, { headers: { 'X-CSRF-TOKEN': refreshToken } })
        .then(response => {
          const csrf = response.data.csrf
          plainAxiosInstance.get('/me').then(meResponse =>
            store.commit('setCurrentUser', {
              currentUser: meResponse.data,
              csrf: csrf
            })
          )
          processQueue(null, csrf)
          resolve(axios(originalRequest))
        })
        .catch(err => {
          store.commit('unsetCurrentUser')
          // redirect to signin in case refresh request fails
          location.replace('/')
          processQueue(err, null)
          reject(err)
        })
        .finally(() => {
          isRefreshing = false
        })
    })
  } else {
    return Promise.reject(error)
  }
})

export { securedAxiosInstance, plainAxiosInstance }
