import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import { query, queryAllUser, createNewCity } from 'services/cityModule'
import { config } from '../utils'
import { message } from 'antd'
import { model } from 'models/common'

const { secret } = config

// const delay = timeout => {
//   return new Promise(resolve => {
//     setTimeout(resolve, timeout)
//   })
// }

const mmBox = message

export default modelExtend(model, {
  namespace: 'cityModule',
  state: {
    data: [],
    total: 0,
    modalVisible: false,
    users: []
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/city') {
          // 默认从第一页开始请求
          dispatch({ type: 'query', payload: {
            page: 1,
            size: 15
          } })
        }
      })
    },
  },
  effects: {

    // 查询全部城市
    * query ({ payload }, { call, put }) {
      const result = yield call(query, parse(payload))
      const { data, total, code } = result

      if (code == 200) {
        yield put({
          type: 'updateState',
          payload: { data: data, total: total },
        })
      }
    },

    // 开通新的城市
    * createCity({ payload }, { call, put }) {
      const result = yield call(createNewCity, parse(payload))
      const { data, message, code } = result

      if (code == 200) {
        mmBox.success(message)
        yield put({ type: 'hideModal' })
        yield put({ type: 'query', payload: {
          page: 1,
          size: 15
        } })
      } else {
        // 创建失败，显示提示信息
        mmBox.error(message)
      }
    },

    // 查询全部用户
    * queryAllUsers({ payload }, { call, put }) {
      const result = yield call(queryAllUser, parse(payload))
      const { data, total, code } = result

      if (code == 200) {
        yield put({
          type: 'updateState',
          payload: { users: data },
        })
      }
    },
  },

  reducers: {
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },
  },
})
