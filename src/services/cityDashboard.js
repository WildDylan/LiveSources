import { request, config } from 'utils'

const { dataApi } = config
const { cityDashboard } = dataApi

export async function query (params) {
  return request({
    url: cityDashboard,
    method: 'get',
    data: params,
  })
}
