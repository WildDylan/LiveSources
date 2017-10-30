import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { color } from 'utils'
import { Page } from 'components'
import styles from './index.less'
import { Table, Icon, Switch, Radio, Form, Button, Spin } from 'antd'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import { Link } from 'react-router-dom'
import Modal from './Modal'

function ApplicationListBoard ({ dispatch, applicationList, loading }) {

  const { id, users, data, total, modalVisible, cityInfo } = applicationList

  const applicationDetail = (event) => {
    const key = event.target.getAttribute("data-key")
    alert(key)
  }

  const createApplication = () => {
    dispatch({
      type: 'applicationList/showModal',
      payload: {
        modalType: 'create',
      },
    })

    dispatch({
      type: `applicationList/queryAllUsers`,
      payload: {}
    })
  }

  const textIconStyle = {
    marginLeft: '5px'
  }

  const columns = [
    {
      title: '应用id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '应用名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '应用平台',
      dataIndex: 'platform',
      key: 'platform',
      render: (text, record) => {
        const platform = record.platform
        if ( platform == 0 ) {
          return (
            <div>
              <Icon type="apple" />
              <span style={textIconStyle}>iOS</span>
            </div>
          )
        } else if ( platform == 1 ) {
          return (
            <div>
              <Icon type="android" />
              <span style={textIconStyle}>Android</span>
            </div>
          )
        } else if ( platform == 2 ) {
          return (
            <div>
              <Icon type="windows" />
              <span style={textIconStyle}>Windows Phone</span>
            </div>
          )
        } else if ( platform == 3 ) {
          return (
            <div>
              <Icon type="ie" />
              <span style={textIconStyle}>Web</span>
            </div>
          )
        } else if ( platform == 4 ) {
          return (
            <div>
              <Icon type="windows-o" />
              <span style={textIconStyle}>Desktop</span>
            </div>
          )
        } else {
          return (<p>其他</p>)
        }
      }
    },
    {
      title: '生产线上',
      dataIndex: 'productUrl',
      key: 'productUrl',
      render: (text, record) => {
        const productUrl = record.productUrl
        if (productUrl) {
          return (<a href={productUrl} target="_blank">访问生产线上地址</a>)
        } else {
          return (<span style={{color: color.red}}>未上线</span>)
        }
      }
    },
    {
      title: '内部测试',
      dataIndex: 'developUrl',
      key: 'developUrl',
      render: (text, record) => {
        const developUrl = record.developUrl
        if (developUrl) {
          return (<a href={developUrl} target="_blank">访问内部测试地址</a>)
        } else {
          return (<span style={{color: color.red}}>未内测</span>)
        }
      }
    },
    {
      title: '版本状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        const status = record.status;
        if (status == 0) {
          const colorBuild = {
            color: color.purple
          }
          return (
            <div>
              <Icon type="smile-o" style={colorBuild} />
              <span style={{...colorBuild, ...textIconStyle}}>初始化</span>
            </div>
          )
        } else if (status === 1) {
          const colorBuild = {
            color: color.blue
          }
          return (
            <div>
              <Icon type="sync" spin={true} style={colorBuild} />
              <span style={{...colorBuild, ...textIconStyle}}>构建中</span>
            </div>
          )
        } else if (status === 2) {
          const colorBuild = {
            color: color.red
          }
          return (
            <div>
              <Icon type="shrink" spin={true} style={colorBuild} />
              <span style={{...colorBuild, ...textIconStyle}}>内测中</span>
            </div>
          )
        } else if (status === 3) {
          const colorBuild = {
            color: color.green
          }
          return (
            <div>
              <Icon type="star" spin={true} style={colorBuild} />
              <span style={{...colorBuild, ...textIconStyle}}>运行中</span>
            </div>
          )
        }
      }
    },
    {
      title: '更新时间',
      dataIndex: 'latestUpdateTime',
      key: 'latestUpdateTime'
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          // 应用详情
          <div>
            <Button onClick={applicationDetail} data-key={record.id} icon='database'>应用详情</Button>
          </div>
        )
      }
    }
  ];

  const tableConfig = {
    bordered: true,
    loading: loading.effects['applicationList/queryApplications'],
    pagination: false,
    title: () => {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <p>{cityInfo.area} - {cityInfo.name} - 应用列表</p>
          <Button icon="plus" type='primary' onClick={createApplication}>新建应用</Button>
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

  const modalProps = {
    item: {},
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['applicationList/createApplication'],
    title: `新建应用`,
    wrapClassName: 'vertical-center-modal',
    dataLoading: loading.effects['applicationList/queryAllUsers'],
    users: users,
    cityId: id,
    onOk (data) {
      dispatch({
        type: `applicationList/createApplication`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'applicationList/hideModal',
      })
    },
  }

  return (
    <Page inner>
      <Table {...tableConfig} columns={columns} dataSource={data} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

ApplicationListBoard.propTypes = {
  cityModule: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ applicationList, loading }) => ({ applicationList, loading }))(ApplicationListBoard)
