import pathToRegexp from 'path-to-regexp'
import { parse } from 'qs'
import { queryModuleInfo, updateModuleInfo } from '../../services/moduleManage'
import { message } from 'antd'
import { model } from 'models/common'
import modelExtend from 'dva-model-extend'
const mmBox = message
import { ContentState, EditorState } from 'draft-js'
import { stateFromMarkdown } from 'draft-js-import-markdown'
import { queryAllUser } from '../../services/cityModule'

export default modelExtend(model, {
  namespace: 'moduleInfo',

  state: {
    data: {
      owner: {}
    },
    editorContent: null,
    modalVisible: false,
    users: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/module/:id').exec(pathname)
        if (match) {
          dispatch({ type: 'queryModuleInfo', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryModuleInfo ({ payload }, { call, put }) {
      const result = yield call(queryModuleInfo, payload)
      const { code, data } = result
      if (code == 200) {
        yield put({ type: 'updateState',
          payload: { data: data, editorContent: EditorState.createWithContent(stateFromMarkdown(data['desc'])) } })
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

    * updateModuleInfo({ payload }, { call, put }) {
      const result = yield call(updateModuleInfo, parse(payload))
      const { data, code, message } = result

      if (code == 200) {
        yield put({ type: 'updateState', payload: { data: data } })
        mmBox.success(message)
      } else {
        mmBox.error(message)
      }
    }
  },

  reducers: {
    editorContent (state, { payload }) {
      return { ...state, ...payload }
    },
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },
    hideModalWithInfo (state, { payload }) {
      return { ...state, ...payload, modalVisible: false }
    }
  },
})
