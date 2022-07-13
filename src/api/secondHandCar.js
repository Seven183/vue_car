import request from '@/utils/request'

export function addSecondHandCar(data) {
  return request({
    url: '/secondHandCar/addSecondHandCar',
    method: 'post',
    data
  })
}

export function deleteSecondHandCar(secondHandCarId) {
  return request({
    url: '/secondHandCar/deleteSecondHandCar/' + secondHandCarId,
    method: 'get',
    params: secondHandCarId
  })
}

export function updateSecondHandCar(data) {
  return request({
    url: '/secondHandCar/updateSecondHandCar',
    method: 'post',
    data
  })
}

export function selectSecondHandCarById(secondHandCarId) {
  return request({
    url: '/secondHandCar/select/' + secondHandCarId,
    method: 'get',
    params: secondHandCarId
  })
}

export function allSecondHandCar(data) {
  return request({
    url: '/secondHandCar/allSecondHandCar',
    method: 'get',
    params: data
  })
}

export function selectCarNumbers() {
  return request({
    url: '/secondHandCar/selectCarNumbers',
    method: 'get'
  })
}

export function selectCarBrands() {
  return request({
    url: '/secondHandCar/selectCarBrands',
    method: 'get'
  })
}

export function selectBuyerPhones() {
  return request({
    url: '/secondHandCar/selectBuyerPhones',
    method: 'get'
  })
}

export function selectBuyerUsers() {
  return request({
    url: '/secondHandCar/selectBuyerUsers',
    method: 'get'
  })
}

export function selectBuyerIdCards() {
  return request({
    url: '/secondHandCar/selectBuyerIdCards',
    method: 'get'
  })
}
