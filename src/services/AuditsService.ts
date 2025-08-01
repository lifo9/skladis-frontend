import { securedAxiosInstance } from '@/services/ApiService'

import CrudService from './CrudService'

const API_PATH = '/audits'
const TYPE = 'audit'
const crud = new CrudService(API_PATH, TYPE)

export function getAudits(params) {
  return crud.getRecords(params)
}

export function getAuditOptions(params) {
  return crud.getOptions(params)
}

export function getStockAudit() {
  return securedAxiosInstance.get('/audits/stock-audit', {
    responseType: 'blob',
    headers: {
      'Accept': 'text/csv'
    }
  })
}
