import request from '@/utils/request'

export function selectTotalAmount() {
  return request({
    url: '/dashBoard/selectTotalAmount',
    method: 'get'
  })
}

export function selectTotalAmountLastYear() {
  return request({
    url: '/dashBoard/selectTotalAmountLastYear',
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

export function selectAmountLastYearByMonth() {
  return request({
    url: '/dashBoard/selectAmountLastYearByMonth',
    method: 'get'
  })
}

export function selectUserCountLastYearByMonth() {
  return request({
    url: '/dashBoard/selectUserCountLastYearByMonth',
    method: 'get'
  })
}

export function selectCarCountByBrandLastYear() {
  return request({
    url: '/dashBoard/selectCarCountByBrandLastYear',
    method: 'get'
  })
}

export function selectCarCountByBrandAndNameLastMonth() {
  return request({
    url: '/dashBoard/selectCarCountByBrandAndNameLastMonth',
    method: 'get'
  })
}

export function selectCarNameAndCountLastYear() {
  return request({
    url: '/dashBoard/selectCarNameAndCountLastYear',
    method: 'get'
  })
}
