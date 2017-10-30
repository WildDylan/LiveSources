import modelExtend from 'dva-model-extend'
import { parse } from 'qs'
import { model } from 'models/common'

export default modelExtend(model, {
  namespace: 'mediaModule',
  state: {

  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/media') {

        }
      })
    },
  },
  effects: {
  },

  reducers: {
  },
})
