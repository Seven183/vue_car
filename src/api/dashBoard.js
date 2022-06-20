import request from '@/utils/request'

export function selectTotalAmount() {
  return request({
    url: '/dashBoard/selectTotalAmount',
    method: 'get'
  })
}

export function selectAmountLastYearByMonth() {
  return request({
    url: '/dashBoard/selectAmountLastYearByMonth',
    method: 'get'
  })
}

export function selectCountUser() {
  return request({
    url: '/dashBoard/selectCountUser',
    method: 'get'
  })
}

export function selectCountUserLastYear() {
  return request({
    url: '/dashBoard/selectCountUserLastYear',
    method: 'get'
  })
}

export function selectCarCountByBrandLastYear() {
  return request({
    url: '/dashBoard/selectCarCountByBrandLastYear',
    method: 'get'
  })
}
