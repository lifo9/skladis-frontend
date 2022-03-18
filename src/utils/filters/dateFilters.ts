import 'dayjs/locale/sk'

import dayjs from 'dayjs'

import StorageService from '@/services/StorageService'

export function formatDate(date: string | number, format = 'D. MMMM YYYY'): string {
  return dayjs(date).locale(getLocale()).format(format)
}

export function formatDateTime(date: string | number, format = 'D. MMMM YYYY HH:mm'): string {
  return dayjs(date).locale(getLocale()).format(format)
}

function getLocale(): string {
  return StorageService.load('main', 'appLanguage') || 'en'
}
