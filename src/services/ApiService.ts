import axios from 'axios'
import store from '@/store'
import { getVueLocale } from '@/services/LanguageService'
import { SIGN_IN_URL } from '@/services/UserService'
import { getMyProfile } from '@/services/MyProfileService'

const API_URL = import.meta.env.VITE_API_BASE_URL
const appLocale = getVueLocale()
// HELPERS

// for multiple parallel requests
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
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

securedAxiosInstance.interceptors.request.use((config) => {
  const method = config.method.toUpperCase()
  if (method !== 'OPTIONS' && method !== 'GET') {
    config.headers = {
      ...config.headers,
      'X-CSRF-TOKEN': store.getters.csrf
    }
  }
  return config
})

securedAxiosInstance.interceptors.response.use(null, async (error) => {
  if (
    store.getters.signedIn &&
    error.response &&
    error.response.config &&
    !error.config._retry &&
    (error.response.status === 401 || error.response.status === 403)
  ) {
    const originalRequest = error.config
    const signOut = originalRequest.method.toUpperCase() === 'DELETE' && originalRequest.url === SIGN_IN_URL
    const refreshToken = store.getters.csrf

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
        .then((response) => {
          const csrf = response.data.csrf
          if (!signOut) {
            getMyProfile().then((me) => {
              const userId = me.data.data.id
              const attributes = me.data.data.attributes
              const roles = me.data.included.filter((inc) => inc.type === 'role').map((role) => role.attributes.name)

              store.commit('setLoggedInUser', {
                currentUser: {
                  id: userId,
                  ...attributes,
                  roles: roles
                },
                csrf: csrf
              })
            })
          }
          processQueue(null, csrf)
          originalRequest.headers['X-CSRF-TOKEN'] = csrf
          resolve(axios(originalRequest))
        })
        .catch((err) => {
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
