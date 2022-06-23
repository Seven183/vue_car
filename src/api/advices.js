import request from '@/utils/request'

export function addAdvice(data) {
  return request({
    url: '/advice/addAdvices',
    method: 'post',
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    data
  })
}

export function deleteAdvice(advicesId) {
  return request({
    url: '/advice/deleteAdvice/' + advicesId,
    method: 'get',
    params: advicesId
  })
}

export function updateAdvice(data) {
  return request({
    url: 'advice/updateAdvice',
    method: 'post',
    data
  })
}

export function selectAdvicesById(advicesId) {
  return request({
    url: 'advice/selectById/' + advicesId,
    method: 'get',
    params: advicesId
  })
}

export function selectAdvicesByCarsRepairNumber(carsRepairNumber) {
  return request({
    url: 'advice/selectByCarsRepairNumber/' + carsRepairNumber,
    method: 'get',
    params: carsRepairNumber
  })
}

export function queryLikeAdvices(data) {
  return request({
    url: 'advice/queryLikeAdvices',
    method: 'get',
    params: data
  })
}

export function allAdvices(data) {
  return request({
    url: 'advice/allAdvices',
    method: 'get',
    params: data
  })
}

