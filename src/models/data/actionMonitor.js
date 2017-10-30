import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import { query } from 'services/cityDashboard'
import { model } from 'models/common'
import { config } from '../../utils'

const { secret } = config

export default modelExtend(model, {
  namespace: 'cityDashboard',
  state: {
    cityS: [],
    spin: true
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/cityDashboard' || pathname === '/') {
          dispatch({ type: 'query', secret: secret })
        }
      })
    },
  },
  effects: {
    * query ({ payload }, { call, put }) {
      const result = yield call(query, parse(payload))

      if (result.code == 200) {
        const cityS = result.data;
        yield put({
          type: 'updateState',
          payload: { cityS: cityS, spin: true },
        })
      }
    },
  },
})
