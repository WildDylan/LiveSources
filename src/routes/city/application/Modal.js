import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Select, Spin } from 'antd'
import city from '../../../utils/city'
import province from '../../../utils/province'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group;
const { TextArea } = Input;


const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({ item = {}, onOk, dispatch, form: { getFieldDecorator, validateFields, getFieldsValue }, ...modalProps }) => {

  const { users, dataLoading, cityId } = modalProps

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      data.cityId = cityId;
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  let managers = []
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    managers.push(<Option key={user.id} value={user.id + ''}>{user.name}</Option>)
  }

  return (
    <Modal {...modalOpts}>
      <Spin spinning={dataLoading}>
        <Form layout="horizontal">
          <FormItem label="应用名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入正确的应用名称',
                  whitespace: true,
                  max: 50
                },
              ],
            })(<Input placeholder="应用名称，例如：微信" />)}
          </FormItem>

          <FormItem label="应用负责人" hasFeedback {...formItemLayout}>
            {getFieldDecorator('ownerId', {
              rules: [
                {
                  required: true,
                  message: '请选择应用负责人',
                },
              ],
            })(
              <Select
                optionFilterProp="children"
                showSearch
                style={{ width: '100%' }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                placeholder="请选择应用负责人">
                {managers}
              </Select>
            )}
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

          <FormItem label="应用线上地址" {...formItemLayout}>
            {getFieldDecorator('productUrl', {
              rules: [
                {
                  required: false,
                  whitespace: true,
                },
              ],
            })(<Input placeholder="应用生产环境地址" />)}
          </FormItem>

          <FormItem label="应用内测地址" {...formItemLayout}>
            {getFieldDecorator('developUrl', {
              rules: [
                {
                  required: false,
                  whitespace: true,
                },
              ],
            })(<Input placeholder="应用测试环境地址" />)}
          </FormItem>

          <FormItem label="初始版本号" {...formItemLayout}>
            {getFieldDecorator('version', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '必须填写默认版本号',
                },
              ],
            })(<Input placeholder="初始应用版本号" />)}
          </FormItem>

          <FormItem label="应用描述" {...formItemLayout}>
            {getFieldDecorator('desc', {
              rules: [
                {
                  required: true,
                  max: 300
                },
              ],
            })(<TextArea autosize={{ minRows: 3, maxRows: 6 }} placeholder="应用描述" />)}
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
