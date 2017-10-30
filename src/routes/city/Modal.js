import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Select, Spin } from 'antd'
import city from '../../utils/city'
import province from '../../utils/province'

const FormItem = Form.Item
const Option = Select.Option

const children = []
let managers = []

for (let i = 0; i < province.length; i++) {
  children.push(<Option key={i} value={province[i]}>{province[i]}</Option>)
}

const handlerSelectAreaChange = (value) => {
  console.log(`selected ${value}`)
}

const handlerSelectManagerChange = (value) => {
  console.log(`selected ${value}`)
}

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  onOk,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        status: 1,
        online: 0,
        newer: 0,
        order: 0,
        ...getFieldsValue(),
      }
      data.manager = data.manager.join("|")
      console.log(data)
      // 处理一下数据，manager合并
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const { users, dataLoading } = modalProps

  managers = []
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    managers.push(<Option key={user.id} value={user.id + ''}>{user.name}</Option>)
  }

  return (
    <Modal {...modalOpts}>
      <Spin spinning={dataLoading}>
        <Form layout="horizontal">
          <FormItem label="城市名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入正确的城市名称',
                  whitespace: true,
                  max: 50
                },
              ],
            })(<Input placeholder="城市名称，例如：宁波市" />)}
          </FormItem>
          <FormItem label="所属省份" hasFeedback {...formItemLayout}>
            {getFieldDecorator('area', {
              rules: [
                {
                  required: true,
                  message: '请选择所属省份',
                },
              ],
            })(
              <Select
                optionFilterProp="children"
                showSearch
                onChange={handlerSelectAreaChange}
                style={{ width: '100%' }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                placeholder="请选择所属省份">
                {children}
              </Select>
            )}
          </FormItem>
          <FormItem label="当前总用户数量" {...formItemLayout}>
            {getFieldDecorator('totalUser', {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message: '请输入正确的总用户数量',
                  pattern: /^([1-9]\d*|[0]{1,1})$/
                },
              ],
            })(<InputNumber placeholder="用户数"/>)}
          </FormItem>
          <FormItem label="当前总交易额" {...formItemLayout}>
            {getFieldDecorator('totalOrder', {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message: '请输入正确的总交易额',
                  pattern: /^([1-9]\d*|[0]{1,1})$/
                },
              ],
            })(<InputNumber placeholder="交易额"/>)}
          </FormItem>
          <FormItem label="城市负责人" hasFeedback {...formItemLayout}>
            {getFieldDecorator('manager', {
              rules: [
                {
                  required: true,
                  message: '请选择城市负责人'
                },
              ],
            })(
              <Select mode="multiple" onChange={handlerSelectManagerChange} style={{ width: '100%' }} placeholder="请选择城市负责人">
                {managers}
              </Select>
            )}
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
