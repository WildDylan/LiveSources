import { request, config } from 'utils'

const { dataApi } = config
const { cityModule, cityInfo, createCity, allUserInfo, cityManagerUpdate, queryCityApplication, createApplication } = dataApi

export async function createCityApplication(params) {
  return request({
    url: createApplication,
    method: 'post',
    data: params,
  })
}

export async function query (params) {
  return request({
    url: cityModule,
    method: 'get',
    data: params,
  })
}

export async function queryCityInfo(params) {
  return request({
    url: cityInfo,
    method: 'get',
    data: params
  })
}

export async function createNewCity(params) {
  return request({
    url: createCity,
    method: 'post',
    data: params
  })
}

export async function updateCityManager(params) {
  return request({
    url: cityManagerUpdate,
    method: 'post',
    data: params
  })
}

export async function queryCityApplications(params) {
  return request({
    url: queryCityApplication,
    method: 'get',
    data: params
  })
}

export async function queryAllUser(params) {
  return request({
    url: allUserInfo,
    method: 'get',
    data: params
  })
}
