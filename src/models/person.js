import modelExtend from 'dva-model-extend'
import { parse } from 'qs'
import { query, queryWithId, updateUser, createUser } from 'services/person'
import { config } from '../utils'
import { message } from 'antd'
const { secret } = config
const mmBox = message
import { model } from 'models/common'

export default modelExtend(model, {
  namespace: 'personInfo',
  state: {
    users: [],
    modalVisible: false,
    editUser: {},
    modalType: ''
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/person') {
          dispatch({ type: 'query', secret: secret })
        }
      })
    },
  },
  effects: {
    * query ({ payload }, { call, put }) {
      const result = yield call(query, parse(payload))

      if (result.code == 200) {
        const users = result.data;

        users.map((item) => item.key = item.id)
        yield put({
          type: 'updateState',
          payload: { users: users },
        })
      }
    },

    * queryUserWithId ({ payload }, { call, put }) {
      const result = yield call(queryWithId, parse(payload))

      const { data, message, code } = result

      if (code == 200) {
        const editUser = result.data;

        yield put({
          type: 'updateState',
          payload: { editUser: editUser },
        })
      } else {
        mmBox.error(message)
      }
    },

    * createUser ({ payload }, { call, put }) {
      const result = yield call(createUser, parse(payload))

      const { data, message, code } = result

      if (code == 200) {
        mmBox.success(message)
        yield put({ type: 'hideModal' })
        yield put({ type: 'query', payload: { secret: secret } })
      } else {
        mmBox.error(message)
      }
    },

    * updateUser ({ payload }, { call, put }) {
      const result = yield call(updateUser, parse(payload))

      const { data, message, code } = result

      if (code == 200) {
        mmBox.success(message)
        yield put({ type: 'hideModal' })
        yield put({ type: 'query', payload: { secret: secret } })
      } else {
        mmBox.error(message)
      }
    }
  },

  reducers: {
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false, editUser: {} }
    },
  },
})
