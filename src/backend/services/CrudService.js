import { securedAxiosInstance } from './ApiService'

class CrudService {
  constructor (API_PATH, TYPE) {
    this.API_PATH = API_PATH
    this.TYPE = TYPE
  }

  getRecords ({ page, perPage, searchQuery, order, orderBy } = {}) {
    let params = {}
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

    return securedAxiosInstance.get(this.API_PATH, { params: params })
  }
  getRecord (id) {
    return securedAxiosInstance.get(this.API_PATH + '/' + id)
  }
  createRecord (params, formData = false) {
    let payload = {}
    if (formData) {
      payload = this._buildFormData(params)
    } else {
      payload[this.TYPE] = params
    }

    return securedAxiosInstance.post(this.API_PATH, payload)
  }
  updateRecord (id, params, formData = false) {
    let payload = {}
    if (formData) {
      payload = this._buildFormData(params)
    } else {
      payload[this.TYPE] = params
    }

    if (!id) {
      id = ''
    }

    return securedAxiosInstance.patch(this.API_PATH + '/' + id, payload)
  }
  deleteRecord (id) {
    return securedAxiosInstance.delete(this.API_PATH + '/' + id)
  }
  _buildFormData (params) {
    let formData = new FormData()

    for (const key in params) {
      if (Array.isArray(params[key])) {
        for (let i = 0; i < params[key].length; i++) {
          formData.append(`${this.TYPE}[${key}][]`, params[key][i])
        }
      } else {
        formData.append(`${this.TYPE}[${key}]`, params[key])
      }
    }

    return formData
  }
}

export default CrudService
