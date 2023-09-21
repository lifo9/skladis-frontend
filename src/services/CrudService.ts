import { securedAxiosInstance } from '@/services/ApiService'

class CrudService {
  API_PATH: string
  TYPE: string
  constructor(API_PATH, TYPE) {
    this.API_PATH = API_PATH
    this.TYPE = TYPE
  }

  getRecords({ page, perPage, searchQuery, order, orderBy, filters }: any = {}, id, subPath) {
    // eslint-disable-next-line prefer-const
    let params = {} as { page; per_page; search; order; order_by; filters }

    if (page) {
      params.page = page
    }
    if (searchQuery) {
      params.search = searchQuery
    }
    if (perPage) {
      params.per_page = perPage
    }
    if (order) {
      params.order = order
    }
    if (orderBy) {
      params.order_by = orderBy
    }
    if (filters && Object.keys(filters).length > 0) {
      filters = Object.keys(filters)
        .map((key) => {
          if (Array.isArray(filters[key]) && filters[key].length > 1) {
            const newKey = key.replace(/[[,]]/, '')
            return { [newKey]: filters[key] }
          } else {
            return { [key]: filters[key] }
          }
        })
        .reduce((a, b) => Object.assign({}, a, b))

      params = { ...params, ...filters }
    }

    let path = this.API_PATH

    if (id) {
      path += `/${id}`
    }
    if (subPath) {
      path += `/${subPath}`
    }

    return securedAxiosInstance.get(path, { params: params })
  }
  getRecord(id) {
    return securedAxiosInstance.get(this.API_PATH + '/' + id)
  }
  getOptions(params) {
    if (params) {
      return securedAxiosInstance.get(this.API_PATH + '/select-options', { params: params })
    } else {
      return securedAxiosInstance.get(this.API_PATH + '/select-options')
    }
  }
  createRecord(params, formData = false, allowEmpty = false, customPath = undefined) {
    let payload = {}
    // eslint-disable-next-line prefer-const
    let headers = { ...securedAxiosInstance.defaults.headers.common }
    if (formData) {
      payload = this._buildFormData(params, allowEmpty)
      headers['Content-Type'] = 'multipart/form-data'
    } else {
      payload[this.TYPE] = params
    }

    let path = this.API_PATH
    if (customPath) {
      path += `/${customPath}`
    }
    return securedAxiosInstance.post(path, payload, { headers: headers })
  }
  updateRecord(id, params, formData = false, allowEmpty = false) {
    let payload = {}
    // eslint-disable-next-line prefer-const
    let headers = { ...securedAxiosInstance.defaults.headers.common }
    if (formData) {
      payload = this._buildFormData(params, allowEmpty)
      headers['Content-Type'] = 'multipart/form-data'
    } else {
      payload[this.TYPE] = params
    }

    if (!id) {
      id = ''
    }

    return securedAxiosInstance.patch(this.API_PATH + '/' + id, payload, { headers: headers })
  }
  deleteRecord(id) {
    return securedAxiosInstance.delete(this.API_PATH + '/' + id)
  }
  _buildFormData(params, allowEmpty) {
    const formData = new FormData()

    for (const key in params) {
      if (Array.isArray(params[key])) {
        for (let i = 0; i < params[key].length; i++) {
          formData.append(`${this.TYPE}[${key}][]`, params[key][i])
        }
        if (allowEmpty && params[key].length === 0) {
          formData.append(`${this.TYPE}[${key}][]`, params[key])
        }
      } else {
        formData.append(`${this.TYPE}[${key}]`, params[key])
      }
    }

    return formData
  }
}

export default CrudService
