import request from '@/utils/request'

export function addCarsRepair(data) {
  return request({
    url: '/carsRepair/addCarsRepair',
    method: 'post',
    data
  })
}

export function deleteCarsRepair(carsRepairNumber) {
  return request({
    url: '/carsRepair/deleteCarsRepair/' + carsRepairNumber,
    method: 'get',
    params: carsRepairNumber
  })
}

export function updateCarsRepair(data) {
  return request({
    url: 'carsRepair/updateCarsRepair',
    method: 'post',
    data
  })
}

export function queryCarsRepairByCarsRepairNumber(carsRepairNumber) {
  return request({
    url: 'carsRepair/select/' + carsRepairNumber,
    method: 'get',
    params: carsRepairNumber
  })
}

export function queryAllCarsRepair(data) {
  return request({
    url: 'carsRepair/allCarsRepairs',
    method: 'get',
    params: data
  })
}

export function detailsByCarsRepairNumber(carsRepairNumber) {
  return request({
    url: 'carsRepair/detailsByCarsRepairNumber/' + carsRepairNumber,
    method: 'get',
    params: carsRepairNumber
  })
}

export function selectCarNumbers() {
  return request({
    url: 'carsRepair/selectCarNumbers',
    method: 'get'
  })
}

export function statusOperate(carsRepairNumber, status) {
  return request({
    url: 'carsRepair/statusOperate',
    method: 'get',
    params: { carsRepairNumber, status }
  })
}

export function selectCarsRepairType() {
  return request({
    url: 'carsRepair/selectCarsRepairType',
    method: 'get'
  })
}
