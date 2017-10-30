import pathToRegexp from 'path-to-regexp'
import { parse } from 'qs'
import { queryCityInfo, queryAllUser, updateCityManager } from '../../services/cityModule'
import { message } from 'antd'
import { model } from 'models/common'
import modelExtend from 'dva-model-extend'
const mmBox = message

export default modelExtend(model, {
  namespace: 'cityInfo',

  state: {
    data: {},
    modalVisible: false,
    users: [],
    spinners: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/city/:id').exec(pathname)
        if (match) {
          dispatch({ type: 'queryCityInfo', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryCityInfo ({
      payload,
    }, { call, put }) {
      const result = yield call(queryCityInfo, payload)
      const { code, data } = result
      if (code == 200) {
        if (data.managerList) {
          let manager = data.managerList;
          manager.map((item)=> {
            item.key = item.id;
          })
          data.managerList = manager;
        }

        yield put({ type: 'updateState', payload: { data: data } })
      }
    },

    // 查询全部用户
    * queryAllUsers({ payload }, { call, put }) {
      const result = yield call(queryAllUser, parse(payload))
      const { data, total, code } = result

      if (code == 200) {
        yield put({ type: 'updateState', payload: { users: data } })
      }
    },

    * updateCityManagers ({ payload }, { call, put }) {
      const result = yield call(updateCityManager, parse(payload))
      const { data, total, code, message } = result

      if (code == 200) {
        mmBox.success(message)
        yield put({ type: 'hideModal' })
        yield put({ type: 'queryCityInfo', payload: { id: data.id } })
      } else {
        mmBox.error(message)
      }
    },

    * removeCityManagers({ payload }, { call, put }) {
      yield put({ type: 'updateState', payload: { spinners: true } })
      const result = yield call(updateCityManager, parse(payload))
      const { data, total, code, message } = result

      if (code == 200) {
        mmBox.success(message)
        yield put({ type: 'queryCityInfo', payload: { id: payload.id } })
      } else {
        mmBox.error(message)
      }
      yield put({ type: 'updateState', payload: { spinners: false } })
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
