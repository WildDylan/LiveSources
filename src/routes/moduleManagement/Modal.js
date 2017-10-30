import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Select, Spin } from 'antd'
import city from '../../utils/city'
import province from '../../utils/province'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

let managers = []

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 18,
  },
}

const modal = ({ item = {}, onOk, dispatch, form: { getFieldDecorator, validateFields, getFieldsValue }, ...modalProps }) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      data.status = 0
      if (data.platform == 0) {
        data.podName = data.name
      } else if (data.platform == 1) {
        data.compileName = data.name
      }
      console.log(data)
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const { userInfo, users, dataLoading, modalType } = modalProps

  managers = []
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    managers.push(<Option key={user.id} value={user.id + ''}>{user.name}</Option>)
  }

  if (modalType === 'create') {
    return (
      <Modal {...modalOpts}>
        <Spin spinning={dataLoading}>
          <Form layout="horizontal">
            <FormItem label="名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入正确的组件名称，只能为英文',
                    whitespace: true,
                    max: 16,
                    pattern: /^[A-Za-z]+$/
                  },
                ],
              })(<Input placeholder="组件名称，例如：YDNetworking" />)}
            </FormItem>
            <FormItem label="负责人" hasFeedback {...formItemLayout}>
              {getFieldDecorator('ownerId', {
                rules: [
                  {
                    required: true,
                    message: '请选择组件负责人',
                  },
                ],
              })(
                <Select
                  optionFilterProp="children"
                  showSearch
                  style={{ width: '100%' }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  placeholder="请选择组件负责人">
                  {managers}
                </Select>
              )}
            </FormItem>

            <FormItem label="初始版本号" {...formItemLayout}>
              {getFieldDecorator('version', {
                initialValue: '1.0.0',
                rules: [
                  {
                    required: true,
                    message: '请输入正确的初始版本号',
                    whitespace: true,
                    max: 16
                  },
                ],
              })(<Input placeholder="组件版本号，例如：1.2.0" />)}
            </FormItem>

            <FormItem label="组件仓库地址" {...formItemLayout}>
              {getFieldDecorator('homePage', {
                rules: [
                  {
                    required: true,
                    message: '请输入正确的组件仓库地址',
                    whitespace: true,
                  },
                ],
              })(<Input placeholder="组件仓库，例如：https://localhost/dylan/YDNetworking.git" />)}
            </FormItem>

            <FormItem label="平台" {...formItemLayout}>
              {getFieldDecorator('platform', {
                rules: [
                  {
                    required: true,
                    message: '请选择正确的平台类型',
                  },
                ],
              })(
                <RadioGroup>
                  <Radio value={0}>iOS</Radio>
                  <Radio value={1}>Android</Radio>
                  <Radio value={2}>Windows Phone</Radio>
                  <Radio value={3}>Web</Radio>
                  <Radio value={4}>Desktop</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="是否为必选" {...formItemLayout}>
              {getFieldDecorator('required', {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                    message: '请选择组件是否为该平台必须，仅对后续创建的App有影响',
                  },
                ],
              })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>

            <FormItem label="组件类型" {...formItemLayout}>
              {getFieldDecorator('type', {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                    message: '请选择组件类型',
                  },
                ],
              })(
                <RadioGroup>
                  <Radio value={1}>基础组件</Radio>
                  <Radio value={0}>业务组件</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    )
  } else {
    return (
      <Modal {...modalOpts} footer={null}>
        <Spin spinning={dataLoading}>
          <Form layout="horizontal">
            <FormItem label="姓名" {...formItemLayout}>
              <p>{userInfo['name']}</p>
            </FormItem>
            <FormItem label="职务" {...formItemLayout}>
              <p>{userInfo['jobTitle']}</p>
            </FormItem>
            <FormItem label="性别" {...formItemLayout}>
              <p>{userInfo['gender'] == 0 ? '女' : userInfo['gender'] == 1 ? '男' : '其他'}</p>
            </FormItem>
            <FormItem label="联系电话" {...formItemLayout}>
              <a href={"tel://" + userInfo['mobile']}>{userInfo['mobile']}</a>
            </FormItem>
            <FormItem label="电子邮箱" {...formItemLayout}>
              <a href={"mailto:" + userInfo['email']}>{userInfo['email']}</a>
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    )
  }
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
