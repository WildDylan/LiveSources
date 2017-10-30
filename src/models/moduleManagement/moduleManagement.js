import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import { query, createNewModule } from 'services/moduleManage'
import { queryAllUser } from 'services/cityModule'
import { model } from 'models/common'
import { config } from '../../utils'
import { message } from 'antd'

const { secret } = config

// const delay = timeout => {
//   return new Promise(resolve => {
//     setTimeout(resolve, timeout)
//   })
// }

const mmBox = message

export default modelExtend(model, {
  namespace: 'moduleManagement',
  state: {
    data: [],
    total: 0,
    modalVisible: false,
    users: [],
    userInfo: {}
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/moduleManagement') {
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

    // 查询全部组件
    * query ({ payload }, { call, put }) {
      const result = yield call(query, parse(payload))
      const { data, total, code } = result

      if (code == 200) {
        data.map((item) => item.key = item.id)
        yield put({
          type: 'updateState',
          payload: { data: data, total: total },
        })
      }
    },

    // 新建组件
    * createModule({ payload }, { call, put }) {
      const result = yield call(createNewModule, parse(payload))
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
