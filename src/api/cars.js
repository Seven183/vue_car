import request from '@/utils/request'

export function addCar(data) {
  return request({
    url: '/car/addCar',
    method: 'post',
    data
  })
}

export function deleteCar(carId) {
  return request({
    url: '/car/deleteCar/' + carId,
    method: 'get',
    params: carId
  })
}

export function updateCar(data) {
  return request({
    url: 'car/updateCar',
    method: 'post',
    data
  })
}

export function selectCarById(carId) {
  return request({
    url: 'car/select/' + carId,
    method: 'get',
    params: carId
  })
}

export function queryLikeCars(data) {
  return request({
    url: 'car/queryLikeCars',
    method: 'get',
    params: data
  })
}

export function allCars(data) {
  return request({
    url: 'car/allCars',
    method: 'get',
    params: data
  })
}

