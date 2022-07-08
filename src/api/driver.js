import request from '@/utils/request'

export function addDriver(data) {
  return request({
    url: '/driver/addDriver',
    method: 'post',
    data
  })
}

export function deleteDriver(driverId) {
  return request({
    url: '/driver/deleteDriver/' + driverId,
    method: 'get',
    params: driverId
  })
}

export function updateDriver(data) {
  return request({
    url: 'driver/updateDriver',
    method: 'post',
    data
  })
}

export function selectDriverById(driverId) {
  return request({
    url: 'driver/selectById/' + driverId,
    method: 'get',
    params: driverId
  })
}

export function selectDriverByCarsRepairNumber(carsRepairNumber) {
  return request({
    url: 'driver/selectByCarsRepairNumber/' + carsRepairNumber,
    method: 'get',
    params: carsRepairNumber
  })
}

export function queryLikeCarsRepair(data) {
  return request({
    url: 'driver/queryLike',
    method: 'get',
    params: data
  })
}

export function allDrivers(data) {
  return request({
    url: 'driver/allDrivers',
    method: 'get',
    params: data
  })
}

export function detailsByCarsRepairNumber(carsRepairNumber) {
  return request({
    url: 'driver/detailsByCarsRepairNumber/' + carsRepairNumber,
    method: 'get',
    params: carsRepairNumber
  })
}
