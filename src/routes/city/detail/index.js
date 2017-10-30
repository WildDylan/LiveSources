import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Page } from 'components'
import { routerRedux } from 'dva/router'
import {
  Form, Select, InputNumber, Switch, Radio,
  Slider, Button, Upload, Icon, Input, Table, Spin
} from 'antd'
import Modal from './Modal'

const CityDetail = ({ dispatch, cityInfo, loading }) => {
  const { data, modalVisible, spinners, users } = cityInfo

  const { id } = data;

  const content = []
  const FormItem = Form.Item;
  const Option = Select.Option;
  const RadioGroup = Radio.Group;

  const modalProps = {
    item: {},
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['cityInfo/updateCityManagers'],
    title: `添加城市管理员`,
    wrapClassName: 'vertical-center-modal',
    dataLoading: loading.effects['cityInfo/queryAllUsers'],
    users: users,
    currentUsers: data.managerList,
    onOk (data) {

      data.type = 'add'
      data.id = id;

      dispatch({
        type: `cityInfo/updateCityManagers`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'cityInfo/hideModal',
      })
    },
  }

  const addCityManager = () => {
    dispatch({
      type: 'cityInfo/showModal',
      payload: {
        modalType: 'create',
      },
    })

    // 传入当前选中的人
    dispatch({
      type: `cityInfo/queryAllUsers`,
      payload: {
        currUser: users
      }
    })
  }

  // 移除这个管理员
  const removeThisManager = (event) => {
    const managerId = event.target.getAttribute("data-key")
    // 开始删除这个人
    let data = {
      type: 'remove',
      id: id,
      manager: managerId
    }

    dispatch({
      type: `cityInfo/removeCityManagers`,
      payload: data,
    })
  }

  const applicationManager = (event) => {
    const query = `/application/` + id
    // 打开城市应用界面详情
    dispatch({type: query, payload: {}})
    dispatch(routerRedux.push({
      pathname: query,
      query: {}
    }))
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const columns = [{
    title: '人员编号',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '职位',
    dataIndex: 'jobTitle',
    key: 'jobTitle',
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '电话号码',
    dataIndex: 'mobile',
    key: 'mobile',
  }, {
    title: '电子邮件',
    dataIndex: 'email',
    key: 'email',
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => {
      return (
        <Button onClick={removeThisManager} type='primary' data-key={record.id}>移除</Button>
      );
    }
  }];

  return (
    <Page inner loading={loading.effects[`cityInfo/queryCityInfo`]}>
      <div className={styles.content}>
        <Form>
          <FormItem {...formItemLayout} label="城市ID：">
            <span className="ant-form-text">{data.id}</span>
          </FormItem>

          <FormItem {...formItemLayout} label="创建时间：">
            <span className="ant-form-text">{data.dateString}</span>
          </FormItem>

          <FormItem {...formItemLayout} label="所属大区：">
            <span className="ant-form-text">{data.area}</span>
          </FormItem>

          <FormItem {...formItemLayout} label="城市名称：">
            <span className="ant-form-text">{data.name}</span>
          </FormItem>

          <FormItem {...formItemLayout} label="创建应用：">
            <span>
              <span className="ant-form-text">{data.applications} 个</span>
              <Button onClick={applicationManager} style={{ paddingLeft: '10px' }}>应用管理</Button>
            </span>
          </FormItem>

          <FormItem {...formItemLayout} label="总用户数/今日新增：">
            <span className="ant-form-text">{data.totalUser ? data.totalUser : 0} 人 / {data.newer ? data.newer : 0} 人</span>
          </FormItem>

          <FormItem {...formItemLayout} label="总交易额/今日交易额：">
            <span className="ant-form-text">{data.totalOrder ? data.totalOrder : 0} 元 / {data.order ? data.order : 0} 元</span>
          </FormItem>

          <FormItem {...formItemLayout} label="城市服务状态：">
            <Switch checkedChildren="运行中" unCheckedChildren="停止运行" checked={data.status}/>
          </FormItem>

          <FormItem {...formItemLayout} label="城市负责人：">
            <Spin spinning={spinners}>
              <Table locale={{emptyText: '该城市暂时没有管理员'}} pagination={false} bordered={true} dataSource={data.managerList} columns={columns} />
            </Spin>
          </FormItem>

          <FormItem wrapperCol={{ span: 12, offset: 6 }}>
            <Button onClick={addCityManager}>添加城市联系人</Button>
          </FormItem>
        </Form>
        {modalVisible && <Modal {...modalProps} />}
      </div>
    </Page>
  )
}

CityDetail.propTypes = {
  cityInfo: PropTypes.object,
}

export default connect(({ cityInfo, loading }) => ({ cityInfo, loading }))(CityDetail)
