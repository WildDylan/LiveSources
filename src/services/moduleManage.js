import { request, config } from 'utils'

const { dataApi } = config
const { moduleListAPI, createNewModuleAPI, queryModuleAPI, updateModuleInfoAPI } = dataApi

export async function query (params) {
  return request({
    url: moduleListAPI,
    method: 'post',
    data: params,
  })
}

export async function createNewModule(params) {
  return request({
    url: createNewModuleAPI,
    method: 'post',
    data: params,
  })
}

export async function queryModuleInfo(params) {
  return request({
    url: queryModuleAPI,
    method: 'get',
    data: params,
  })
}

export async function updateModuleInfo(params) {
  return request({
    url: updateModuleInfoAPI,
    method: 'post',
    data: params,
  })
}
