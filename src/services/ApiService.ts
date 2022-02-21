import axios from 'axios'

import { getVueLocale } from '@/services/LanguageService'
import { getMyProfile } from '@/services/MyProfileService'
import { SIGN_IN_URL } from '@/services/UserService'
import { useMainStore } from '@/stores/mainStore'

const API_URL = import.meta.env.VITE_API_BASE_URL as string
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
  const store = useMainStore()

  const method = config.method.toUpperCase()
  if (method !== 'OPTIONS' && method !== 'GET') {
    config.headers = {
      ...config.headers,
      'X-CSRF-TOKEN': store.csrf
    }
  }
  return config
})

securedAxiosInstance.interceptors.response.use(null, async (error) => {
  const store = useMainStore()

  if (
    store.signedIn &&
    error.response &&
    error.response.config &&
    !error.config._retry &&
    (error.response.status === 401 || error.response.status === 403)
  ) {
    const originalRequest = error.config
    const signOut = originalRequest.method.toUpperCase() === 'DELETE' && originalRequest.url === SIGN_IN_URL
    const refreshToken = store.csrf

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

              store.setLoggedInUser(
                {
                  id: userId,
                  ...attributes,
                  roles: roles
                },
                csrf
              )
            })
          }
          processQueue(null, csrf)
          originalRequest.headers['X-CSRF-TOKEN'] = csrf
          resolve(axios(originalRequest))
        })
        .catch((err) => {
          store.unsetCurrentUser()
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

export { plainAxiosInstance, securedAxiosInstance }
