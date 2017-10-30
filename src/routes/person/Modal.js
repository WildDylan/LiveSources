import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Select, Spin } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group;

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
  const { editUser, dataLoading, modalType } = modalProps

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {};
      if ( modalType === 'edit' ) {
        data = {
          id: editUser.id,
          ...getFieldsValue(),
        }
      } else {
        data = {
          ...getFieldsValue(),
        }
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  return (
    <Modal {...modalOpts}>
      <Spin spinning={dataLoading}>
        <Form layout="horizontal">
          <FormItem label="姓名" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: editUser.name,
              rules: [
                {
                  required: true,
                  message: '姓名不能为空，最长10个字',
                  whitespace: true,
                  max: 10
                },
              ],
            })(<Input placeholder="姓名，例如：郭少兵" />)}
          </FormItem>
          <FormItem label="职位名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('jobTitle', {
              initialValue: editUser.jobTitle,
              rules: [
                {
                  required: true,
                  message: '请输入职位名称',
                },
              ],
            })(<Input placeholder="职位名称，例如：宁波大区经理" />)}
          </FormItem>
          <FormItem label="性别" {...formItemLayout}>
            {getFieldDecorator('gender', {
              initialValue: editUser.gender,
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <RadioGroup>
                <Radio style={radioStyle} value={0}>女</Radio>
                <Radio style={radioStyle} value={1}>男</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="联系电话" {...formItemLayout}>
            {getFieldDecorator('mobile', {
              initialValue: editUser.mobile,
              rules: [
                {
                  required: true,
                  message: '联系电话不得为空',
                  whitespace: true,
                  max: 11
                },
              ],
            })(<Input placeholder="联系电话，例如：13088488288" />)}
          </FormItem>
          <FormItem label="电子邮箱" {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: editUser.email,
              rules: [
                {
                  required: true,
                  message: '电子邮箱不得为空',
                  whitespace: true,
                },
              ],
            })(<Input placeholder="电子邮箱，例如：dylan@china.com" />)}
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
