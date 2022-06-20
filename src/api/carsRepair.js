import request from '@/utils/request'

export function addCarsRepair(data) {
  return request({
    url: '/carsRepair/addCarsRepair',
    method: 'post',
    data
  })
}

export function deleteCarsRepair(carsRepairId) {
  return request({
    url: '/carsRepair/deleteCarsRepair/' + carsRepairId,
    method: 'get',
    params: carsRepairId
  })
}

export function updateCarsRepair(data) {
  return request({
    url: 'carsRepair/updateCarsRepair',
    method: 'post',
    data
  })
}

export function queryCarsRepairById(carsRepairId) {
  return request({
    url: 'carsRepair/select/' + carsRepairId,
    method: 'get',
    params: carsRepairId
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

export function statusOperate(carsRepairId, status) {
  return request({
    url: 'carsRepair/statusOperate',
    method: 'get',
    params: { carsRepairId, status }
  })
}
