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
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
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

  const { users, currentUsers, dataLoading } = modalProps

  let managers = []
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    // 如果已经存在的 就不添加了
    let isHave = false;
    for ( let j = 0; j < currentUsers.length; j ++ ) {
      const cUser = currentUsers[j]
      if (user.id == cUser.id) {
        isHave = true
      }
    }
    if ( !isHave ) {
      managers.push(<Option key={user.id} value={user.id + ''}>{user.id} - {user.jobTitle} - {user.name}</Option>)
    }
  }

  return (
    <Modal {...modalOpts}>
      <Spin spinning={dataLoading}>
        <Form layout="horizontal">
          <FormItem label="添加城市负责人" hasFeedback {...formItemLayout}>
            {getFieldDecorator('manager', {
              rules: [
                {
                  required: true,
                  message: '请选择城市负责人'
                },
              ],
            })(
              <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择城市负责人">
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
