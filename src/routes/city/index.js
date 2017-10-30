import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { color } from 'utils'
import { Page } from 'components'
import styles from './index.less'
import { Table, Icon, Switch, Radio, Form, Button, message } from 'antd'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import { Link } from 'react-router-dom'
import Modal from './Modal'

function CityManagementBoard ({ dispatch, cityModule, loading }) {

  // 打开应用管理界面
  const applicationManager = (event) => {
    const key = event.target.getAttribute("data-key")
    const query = `application/` + key
    // 打开城市应用界面详情
    dispatch({type: query, payload: {}})
    dispatch(routerRedux.push({
      pathname: query,
      query: {}
    }))
  }

  // 名称单元格选中
  const onNameColumnRowClick = (record, event) => {
    const query = `city/` + record['key']
    // 打开城市详情
    dispatch({type: query, payload: {}})
    dispatch(routerRedux.push({
      pathname: query,
      query: {}
    }))
  }

  // 开通新城市
  const createNewCity = () => {
    dispatch({
      type: 'cityModule/showModal',
      payload: {
        modalType: 'create',
      },
    })

    dispatch({
      type: `cityModule/queryAllUsers`,
      payload: {}
    })
  }

  const columns = [
    {
      title: '城市id',
      dataIndex: 'city.id',
      key: 'city.id'
    },
    {
      title: '城市名称',
      dataIndex: 'city.name',
      key: 'city.name',
      onCellClick: onNameColumnRowClick,
      // width: 100,
      render: (area, record) => <Link to={`${record['key']}`}>{area}</Link>
    },
    {
      title: '区域名称',
      dataIndex: 'city.area',
      key: 'city.area',
    },
    {
      title: '运行应用',
      dataIndex: 'city.applications',
      key: 'city.applications',
      render: (text) => <p>{text}（个）</p>
    },
    {
      title: '在线人数',
      dataIndex: 'city.online',
      key: 'city.online',
      render: (text) => <p>{text}（人）</p>
    },
    {
      title: '新增人数',
      dataIndex: 'city.newer',
      key: 'city.newer',
      render: (text) => <p>{text}（人）</p>
    },
    {
      title: '日交易额',
      dataIndex: 'city.order',
      key: 'city.order',
      render: (text) => <p>{text}（元）</p>
    },
    {
      title: '总注册用户',
      dataIndex: 'city.totalUser',
      key: 'city.totalUser',
      render: (text) => <p>{text}（人）</p>
    },
    {
      title: '总交易额',
      dataIndex: 'city.totalOrder',
      key: 'city.totalOrder',
      render: (text) => <p>{text}（元）</p>
    },
    {
      title: '城市开通时间',
      dataIndex: 'city.dateString',
      key: 'city.dateString'
    },
    {
      title: '运行状态',
      dataIndex: 'city.status',
      key: 'city.status',
      render: (status, record) => {
        return (
          <div>
            { record.city.status
              ?
              <p style={{ color: color.green }}>运行中</p>
              :
              <p style={{ color: color.red }}>停止运行</p>
            }
          </div>
        )
      }
    },
    {
      title: '操作',
      key: 'actions',
      render: (text, record) => {
        return (
          <span>
          <Button onClick={applicationManager} data-key={record.key}>应用管理</Button>
        </span>
        );
      },
    }
  ];

  const { data, total, modalVisible, users } = cityModule

  const modalProps = {
    item: {},
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['cityModule/createCity'],
    title: `开通新城市`,
    wrapClassName: 'vertical-center-modal',
    dataLoading: loading.effects['cityModule/queryAllUsers'],
    users: users,
    onOk (data) {
      dispatch({
        type: `cityModule/createCity`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'cityModule/hideModal',
      })
    },
  }

  const onPageSelectedChange = (pagination, filters, sorter) => {
    const page = pagination.current;
    const size = pagination.pageSize;
    // Next page
    dispatch({
      type: `cityModule/query`,
      payload: {
        page: page,
        size: size
      },
    })
  }

  const tableConfig = {
    bordered: true,
    loading: loading.effects['cityModule/query'],
    pagination: {
      defaultPageSize: 15,
      showQuickJumper: true,
      total: total
    },
    title: () => {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <p>已开通城市</p>
          <Button onClick={createNewCity} icon="plus" type='primary'>开通新城市</Button>
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

CityManagementBoard.propTypes = {
  cityModule: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ cityModule, loading }) => ({ cityModule, loading }))(CityManagementBoard)
