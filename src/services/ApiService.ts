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
    common: {
      'Content-Type': 'application/json',
      Locale: appLocale
    }
  }
})

const plainAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    common: {
      'Content-Type': 'application/json',
      Locale: appLocale
    }
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

securedAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const store = useMainStore()
    const originalRequest = error.config

    if (
      store.signedIn &&
      error.response &&
      !originalRequest._retry &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Check if this is a sign-out request
      const isSignOut = originalRequest.method?.toUpperCase() === 'DELETE' && originalRequest.url === SIGN_IN_URL

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((csrf) => {
            originalRequest.headers['X-CSRF-TOKEN'] = csrf
            return axios(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await plainAxiosInstance.post(
          '/refresh',
          {},
          {
            headers: { 'X-CSRF-TOKEN': store.csrf }
          }
        )

        const csrf = response.data.csrf

        if (!isSignOut) {
          try {
            const me = await getMyProfile()
            const userId = me.data.data.id
            const attributes = me.data.data.attributes
            const roles = me.data.included.filter((inc) => inc.type === 'role').map((role) => role.attributes.name)

            store.setLoggedInUser({ id: userId, ...attributes, roles }, csrf)
          } catch (profileError) {
            console.error('Profile fetch failed:', profileError)
          }
        }

        processQueue(null, csrf)
        originalRequest.headers['X-CSRF-TOKEN'] = csrf
        return axios(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        store.unsetCurrentUser()
        location.replace('/')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export { plainAxiosInstance, securedAxiosInstance }
