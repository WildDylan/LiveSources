import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Select, Spin } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

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

  const { users, dataLoading } = modalProps

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...getFieldsValue(),
      }
      // 找到id的这个人

      for (let i = 0; i < users.length; i++) {
        const user = users[i]
        if ( parseInt(user.id) == parseInt(data.manager) ) {
          data = user;
        }
      }
      console.log(data)
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
    managers.push(<Option key={user.id} value={user.id + ''}>{user.id} - {user.jobTitle} - {user.name}</Option>)
  }

  return (
    <Modal {...modalOpts}>
      <Spin spinning={dataLoading}>
        <Form layout="horizontal">
          <FormItem label="组件负责人" hasFeedback {...formItemLayout}>
            {getFieldDecorator('manager', {
              rules: [
                {
                  required: true,
                  message: '请选择组件负责人'
                },
              ],
            })(
              <Select style={{ width: '100%' }} placeholder="请选择组件负责人">
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
