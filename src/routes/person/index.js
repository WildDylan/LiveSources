import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import { Table, Icon, Switch, Radio, Form, Button, Spin } from 'antd'
import { connect } from 'dva'
import { color } from 'utils'
import { Page } from 'components'
import Modal from './Modal'

function PersonInfoBoard ({ dispatch, personInfo, loading }) {
  // 创建用户
  const createUserAction = (event) => {
    dispatch({
      type: 'personInfo/showModal',
      payload: {
        modalType: 'create',
      },
    })
  }

  // 编辑用户
  const editUserAction = (event) => {
    const key = event.target.getAttribute("data-key")
    dispatch({
      type: 'personInfo/showModal',
      payload: {
        modalType: 'edit',
      },
    })

    // 获取选中用户的信息
    dispatch({
      type: `personInfo/queryUserWithId`,
      payload: { id: key }
    })
  }

  const { users, modalVisible, editUser, modalType } = personInfo

  const modalProps = {
    item: {},
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: modalType === 'create' ? loading.effects['personInfo/createUser'] : loading.effects['personInfo/updateUser'],
    title: modalType === 'create' ? `新增用户`: `编辑信息`,
    wrapClassName: 'vertical-center-modal',
    dataLoading: modalType === 'edit' ? loading.effects['personInfo/queryUserWithId'] : false,
    editUser: editUser,
    modalType: modalType,
    onOk (data) {
      if ( modalType === 'create' ) {
        dispatch({
          type: `personInfo/createUser`,
          payload: data,
        })
      } else {
        dispatch({
          type: `personInfo/updateUser`,
          payload: data,
        })
      }
    },
    onCancel () {
      dispatch({
        type: 'personInfo/hideModal',
      })
    },
  }

  const textIconStyle = {
    marginLeft: '5px'
  }

  const columns = [
    {
      title: '用户id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '用户职位',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
    },
    {
      title: '用户姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (text, record) => {
        if (record.gender == 0) {
          return (
            <span>女</span>
          )
        } else if (record.gender == 1) {
          return (
            <span>男</span>
          )
        } else {
          return (
            <span>其他</span>
          )
        }
      }
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (text) => <a href={"tel://" + text}>{text}</a>
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <a href={"mailto:" + text}>{text}</a>
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <div>
            <Button data-key={record.id} icon="edit" onClick={editUserAction}>编辑</Button>
          </div>
        )
      }
    }
  ];

  const tableConfig = {
    bordered: true,
    loading: loading.effects[`personInfo/query`],
    pagination: false,
    title: () => {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <p>用户列表</p>
          <Button icon="plus" type='primary' onClick={createUserAction}>新增用户</Button>
        </div>
      )
    },
    locale: {
      emptyText: '暂时没有数据哦...'
    },
    style: {
      backgroundColor: color.white
    }
  }

  return (
    <Page inner>
      <Table {...tableConfig} columns={columns} dataSource={users} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

PersonInfoBoard.propTypes = {
  personInfo: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ personInfo, loading }) => ({ personInfo, loading }))(PersonInfoBoard)
