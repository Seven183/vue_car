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
    url: '/carsRepair/deleteCarsRepair/{carsRepairId}',
    method: 'get',
    params: { carsRepairId }
  })
}

export function updateCarsRepair() {
  return request({
    url: 'carsRepair/updateCarsRepair',
    method: 'post'
  })
}

export function queryCarsRepairById(carsRepairId) {
  return request({
    url: 'carsRepair/select/{carsRepairId}',
    method: 'get',
    params: { carsRepairId }
  })
}

export function queryLikeCarsRepair() {
  return request({
    url: 'carsRepair/queryLike',
    method: 'get'
  })
}

export function queryAllCarsRepair() {
  return request({
    url: 'carsRepair/allCarsRepair',
    method: 'get'
  })
}

