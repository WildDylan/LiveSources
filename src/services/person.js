import { request, config } from 'utils'

const { dataApi } = config
const { allUserInfo, userInfoWithId, updateUserInfo, createNewUser } = dataApi

export async function query (params) {
  return request({
    url: allUserInfo,
    method: 'get',
    data: params,
  })
}

export async function queryWithId(params) {
  return request({
    url: userInfoWithId,
    method: 'get',
    data: params,
  })
}

export async function updateUser(params) {
  return request({
    url: updateUserInfo,
    method: 'post',
    data: params,
  })
}

export async function createUser(params) {
  return request({
    url: createNewUser,
    method: 'post',
    data: params,
  })
}
