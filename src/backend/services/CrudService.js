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
      payload = params
    } else {
      payload[this.TYPE] = params
    }

    return securedAxiosInstance.post(this.API_PATH, payload)
  }
  updateRecord (id, params, formData = false) {
    let payload = {}
    if (formData) {
      payload = params
    } else {
      payload[this.TYPE] = params
    }

    return securedAxiosInstance.patch(this.API_PATH + '/' + id, payload)
  }
  deleteRecord (id) {
    return securedAxiosInstance.delete(this.API_PATH + '/' + id)
  }
}

export default CrudService