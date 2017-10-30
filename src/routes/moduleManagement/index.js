import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { color } from 'utils'
import { Page } from 'components'
import styles from './index.less'
import { Table, Icon, Switch, Radio, Form, Button, message, Input } from 'antd'
import { Link } from 'react-router-dom'
import Modal from './Modal'
import { routerRedux } from 'dva/router'

function ModulesBoard ({ dispatch, moduleManagement, loading }) {

  const { data, total, modalVisible, users, userInfo, modalType } = moduleManagement

  const goToModuleDetail = (id) => {
    const query = `module/` + id
    // 打开组件详情
    dispatch({type: query, payload: {}})
    dispatch(routerRedux.push({
      pathname: query,
      query: {}
    }))
  }

  const moduleDetailHandler = (event) => {
    goToModuleDetail(event.target.getAttribute("data-key"))
  }

  const onModuleNameColumnRowClick = (record, event) => {
    goToModuleDetail(record['id'])
  }

  const onNameColumnRowClick = (record, event) => {
    const userInfo = record['owner']
    // Modal open this
    dispatch({
      type: 'moduleManagement/showModal',
      payload: {
        modalType: 'showUserInfo',
        userInfo: userInfo,
        footer: {}
      },
    })
  }

  const createModuleHandler = (event) => {
    dispatch({
      type: 'moduleManagement/showModal',
      payload: {
        modalType: 'create',
      },
    })

    dispatch({
      type: `moduleManagement/queryAllUsers`,
      payload: {}
    })
  }

  const modalProps = {
    item: {},
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['moduleManagement/createModule'],
    title: modalType === 'create' ? `新建组件` : `负责人信息`,
    wrapClassName: 'vertical-center-modal',
    dataLoading: modalType === 'create' ? loading.effects['moduleManagement/queryAllUsers'] : false,
    users: users,
    userInfo: userInfo,
    modalType: modalType,
    onOk (data) {
      dispatch({
        type: `moduleManagement/createModule`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'moduleManagement/hideModal',
      })
    },
  }

  const textIconStyle = {
    marginLeft: '5px'
  }

  const onPageSelectedChange = (pagination, filters, sorter) => {
    const page = pagination.current;
    const size = pagination.pageSize;
    // Next page
    dispatch({
      type: `moduleManagement/query`,
      payload: {
        page: page,
        size: size,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      },
    })
  }

  const columns = [
    {
      title: '组件id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '组件类型',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => {
        const type = record.type;
        if ( type == 0 )
          return (<p style={{color: color.red}}>业务组件</p>)
        else
          return (<p style={{color: color.blue}}>基础组件</p>)
      },
      filters: [
        { text: '业务组件', value: '0' },
        { text: '基础组件', value: '1' },
      ],
      filterMultiple: false,
      sorter: true
    },
    {
      title: '组件名称',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      onCellClick: onModuleNameColumnRowClick,
      render: (text, record) => <p style={{color: color.black}}>{text}</p>
    },
    {
      title: '最新版本号',
      dataIndex: 'version',
      key: 'version'
    },
    {
      title: '组件主页',
      dataIndex: 'homePage',
      key: 'homePage',
      render: (text, record) => <Link to={`${record['homePage']}`}>仓库地址</Link>
    },
    {
      title: '应用平台',
      dataIndex: 'platform',
      key: 'platform',
      filters: [
        { text: 'iOS', value: '0' },
        { text: 'Android', value: '1' },
        { text: 'Windows Phone', value: '2' },
        { text: 'Web', value: '3' },
        { text: 'Desktop', value: '4' },
      ],
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
      title: '版本状态',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: '初始化', value: '0' },
        { text: '构建中', value: '1' },
        { text: '内测中', value: '2' },
        { text: '运行中', value: '3' },
      ],
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
      title: '必选',
      dataIndex: 'required',
      key: 'required',
      filters: [
        { text: '是', value: '1' },
        { text: '否', value: '0' },
      ],
      render: (text, record) => {
        const required = record.required
        if (required) {
          return (<p>是</p>)
        } else {
          return (<p>否</p>)
        }
      }
    },
    {
      title: '样例',
      key: 'codeName',
      render: (text, record) => {
        const platform = record.platform;
        if (platform == 0) {
          return (<p>pod '{record[`podName`]}' ~> '{record.version}'</p>)
        } else if (platform == 1) {
          return (<p>compile '{record[`compileName`]}'</p>)
        } else {
          return (<p>无</p>)
        }
      }
    },
    {
      title: '负责人',
      key: 'owner',
      onCellClick: onNameColumnRowClick,
      render: (owner, record) => {
        return (
          <Button ghost={true} style={{color: color.blue}}>{record['owner']['name']}</Button>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          // 应用详情
          <div>
            <Button onClick={moduleDetailHandler} data-key={record.id} icon='database'>组件详情</Button>
          </div>
        )
      }
    }
  ];

  const tableConfig = {
    bordered: true,
    loading: loading.effects['moduleManagement/query'],
    pagination: {
      defaultPageSize: 15,
      showQuickJumper: true,
      total: total
    },
    title: () => {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <p>组件列表</p>
          <Button icon="plus" type='primary' onClick={createModuleHandler}>新建组件</Button>
        </div>
      )
    },
    // rowSelection: {
    //   type: 'radio'
    // },
    onChange: onPageSelectedChange,
    locale: {
      emptyText: '暂时没有数据哦...'
    },
    style: {
      backgroundColor: color.white
    }
  }

  return (
    <Page inner>
      <Table {...tableConfig} columns={columns} dataSource={data} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

ModulesBoard.propTypes = {
  moduleManagement: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ moduleManagement, loading }) => ({ moduleManagement, loading }))(ModulesBoard)
