import pathToRegexp from 'path-to-regexp'
import { parse } from 'qs'
import { queryCityApplications, queryAllUser, createCityApplication } from '../../services/cityModule'

import { message } from 'antd'
import { model } from 'models/common'
import modelExtend from 'dva-model-extend'
const mmBox = message

export default modelExtend(model, {
  namespace: 'applicationList',

  state: {
    data: [],
    modalVisible: false,
    total: 0,
    cityInfo: {},
    users: [],
    id: ''
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, put }) => {
        const match = pathToRegexp('/application/:id').exec(pathname)
        if (match) {
          dispatch({ type: 'queryApplications', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryApplications ({
                       payload,
                     }, { call, put, select }) {
      yield put({ type: `updateState`, payload: { id: payload.id + '' } })
      const result = yield call(queryCityApplications, payload)
      const { code, data, total } = result

      if (code == 200) {
        data.applications.map((item) => item.key = item.id )
        yield put({ type: 'updateState', payload: { data: data.applications, total: data.applications.length, cityInfo: data.city } })
      }
    },

    // 查询全部用户
    * queryAllUsers ({ payload }, { call, put }) {
      const result = yield call(queryAllUser, parse(payload))
      const { data, total, code } = result

      if (code == 200) {
        yield put({
          type: 'updateState',
          payload: { users: data },
        })
      }
    },

    // 创建新的应用
    * createApplication ({ payload }, { call, put, select }) {
      const result = yield call(createCityApplication, parse(payload))
      const { code, message } = result

      if (code == 200) {
        mmBox.success(message)
        yield put({ type: 'hideModal' })
        const id = yield select(state => state.applicationList.id)
        yield put({ type: 'queryApplications', payload: { id: id } })
      } else {
        // 创建失败，显示提示信息
        mmBox.error(message)
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
