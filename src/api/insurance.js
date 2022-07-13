import request from '@/utils/request'

export function addInsurance(data) {
  return request({
    url: '/insurance/addInsurance',
    method: 'post',
    data
  })
}

export function deleteInsurance(insuranceCode) {
  return request({
    url: '/insurance/deleteInsurance/' + insuranceCode,
    method: 'get',
    params: insuranceCode
  })
}

export function updateInsurance(data) {
  return request({
    url: '/insurance/updateInsurance',
    method: 'post',
    data
  })
}

export function selectInsuranceByInsuranceCode(insuranceCode) {
  return request({
    url: '/insurance/select/' + insuranceCode,
    method: 'get',
    params: insuranceCode
  })
}

export function allInsurance(data) {
  return request({
    url: '/insurance/allInsurance',
    method: 'get',
    params: data
  })
}

export function selectInsuranceCompanyName() {
  return request({
    url: '/insurance/selectInsuranceCompanyName',
    method: 'get'
  })
}

export function selectInsuranceCode() {
  return request({
    url: '/insurance/selectInsuranceCode',
    method: 'get'
  })
}

export function selectInsuranceUser() {
  return request({
    url: '/insurance/selectInsuranceUser',
    method: 'get'
  })
}

export function selectInsuranceIdCard() {
  return request({
    url: '/insurance/selectInsuranceIdCard',
    method: 'get'
  })
}

export function selectInsurancePhone() {
  return request({
    url: '/insurance/selectInsurancePhone',
    method: 'get'
  })
}
