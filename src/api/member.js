import request from '@/utils/request'

export function addMember(data) {
  return request({
    url: '/member/addMember',
    method: 'post',
    data
  })
}

export function deleteMember(memberId) {
  return request({
    url: '/member/deleteMember/' + memberId,
    method: 'get',
    params: memberId
  })
}

export function updateMember(data) {
  return request({
    url: 'member/updateMember',
    method: 'post',
    data
  })
}

export function selectMemberById(memberId) {
  return request({
    url: 'member/select/' + memberId,
    method: 'get',
    params: memberId
  })
}

export function selectCarNumbers() {
  return request({
    url: 'member/selectCarNumbers',
    method: 'get'
  })
}

export function allMember(data) {
  return request({
    url: 'member/allMember',
    method: 'get',
    params: data
  })
}

