import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Page } from 'components'
import { routerRedux } from 'dva/router'
import { Row, Col, Card, Form, Select, InputNumber, Switch, Radio, Slider, Button, Upload, Icon, Input, Table, Spin } from 'antd'
import { color } from 'utils'
import { Editor } from 'components'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import draftToMarkdown from 'draftjs-to-markdown'
import Modal from './Modal'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


const ModuleDetail = ({ dispatch, moduleInfo, loading, form: { getFieldDecorator, validateFields } }) => {
  const { data, editorContent, modalVisible, users } = moduleInfo
  let realDesc = data['desc']

  const modalProps = {
    item: {},
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: false,
    title: `修改组件负责人`,
    wrapClassName: 'vertical-center-modal',
    dataLoading: loading.effects['moduleInfo/queryAllUsers'],
    users: users,
    onOk (modalData) {
      data.ownerId = modalData.id
      data.owner = modalData
      dispatch({
        type: 'moduleInfo/hideModalWithInfo',
        payload: {data: data}
      })
    },
    onCancel () {
      dispatch({
        type: 'moduleInfo/hideModal',
      })
    },
  }

  const colProps = {
    lg: 12,
    md: 24,
  }

  const textareaStyle = {
    minHeight: 496,
    width: '100%',
    background: '#f7f7f7',
    borderColor: '#F1F1F1',
    padding: '16px 8px',
  }

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  }

  const textIconStyle = {
    marginLeft: '5px'
  }

  const getPlatform = () => {
    const platform = data['platform']
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

  const getStatus = () => {
    const status = data['status'];
    if (status == 0) {
      const colorBuild = {
        color: color.purple
      }
      return (
        <span>
          <Icon type="smile-o" style={colorBuild} />
          <span style={{...colorBuild, ...textIconStyle}}>初始化</span>
        </span>
      )
    } else if (status === 1) {
      const colorBuild = {
        color: color.blue
      }
      return (
        <span>
          <Icon type="sync" spin={true} style={colorBuild} />
          <span style={{...colorBuild, ...textIconStyle}}>构建中</span>
        </span>
      )
    } else if (status === 2) {
      const colorBuild = {
        color: color.red
      }
      return (
        <span>
          <Icon type="shrink" spin={true} style={colorBuild} />
          <span style={{...colorBuild, ...textIconStyle}}>内测中</span>
        </span>
      )
    } else if (status === 3) {
      const colorBuild = {
        color: color.green
      }
      return (
        <span>
          <Icon type="star" spin={true} style={colorBuild} />
          <span style={{...colorBuild, ...textIconStyle}}>运行中</span>
        </span>
      )
    }
  }

  const getUseSample = () => {
    const platform = data['platform'];
    if (platform == 0) {
      return (<p>pod '{data[`podName`]}' ~> '{data['version']}'</p>)
    } else if (platform == 1) {
      return (<p>compile '{data[`compileName`]}'</p>)
    } else {
      return (<p>无</p>)
    }
  }

  const onEditorStateChange = (editorContent) => {
    dispatch({
      type: 'moduleInfo/editorContent',
      payload: {
        editorContent: editorContent
      },
    })
    realDesc = editorContent ? draftToMarkdown(convertToRaw(editorContent.getCurrentContent())) : ''
    data.desc = realDesc
  }

  const changeOwner = (event) => {
    // 更换负责人
    dispatch({
      type: 'moduleInfo/showModal',
      payload: {
        modalType: 'create',
      },
    })

    // 传入当前选中的人
    dispatch({
      type: `moduleInfo/queryAllUsers`,
      payload: {
        currUser: users
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        // 组装数据
        data.name = values.name
        data.required = values.required
        data.homePage = values.homePage
        data.type = values.type

        if (data.platform == 0) {
          data.podName = data.name
        } else if (data.platform == 1) {
          data.compileName = data.name
        }

        console.log(data)

        dispatch({
          type: 'moduleInfo/updateModuleInfo',
          payload: data
        })
      }
    })
  }

  return (
    <Page inner loading={loading.effects[`moduleInfo/queryModuleInfo`]}>
      <div className={styles.content}>
        <Form onSubmit={handleSubmit}>

          <FormItem {...formItemLayout} label="ID：">
            <span className="ant-form-text">{data.id}</span>
          </FormItem>

          <FormItem label="名称：" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: data['name'],
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

          <FormItem label="平台：" {...formItemLayout}>
            {getPlatform()}
          </FormItem>

          <FormItem label="组件类型" {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: Number(data['type']),
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

          <FormItem label="是否为必选" {...formItemLayout}>
            {getFieldDecorator('required', {
              initialValue: Number(data['required']),
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

          <FormItem label="版本号（以 GIT/Release 为准）：" {...formItemLayout}>
            <p>{data['version']}</p>
            {
              // git校验 -----> 版本获取 -----> 组件状态
            }
          </FormItem>

          <FormItem label="仓库地址：" {...formItemLayout}>
            {getFieldDecorator('homePage', {
              initialValue: data['homePage'],
              rules: [
                {
                  required: true,
                  message: '请输入正确的仓库地址',
                  whitespace: true,
                },
              ],
            })(<Input placeholder="仓库地址，例如：http://xxx.com/xxx.git" />)}
          </FormItem>

          <FormItem label="状态（以 GIT 或者脚本状态为准）" {...formItemLayout}>
            {getStatus()}
          </FormItem>

          <FormItem label="使用样例：" {...formItemLayout}>
            {getUseSample()}
          </FormItem>

          <FormItem label="负责人（点击更改负责人）：" {...formItemLayout}>
            <Button onClick={changeOwner}>{"[" + data['owner']['id'] + "] - " + data['owner']['jobTitle'] + " - " + data['owner']['name']}</Button>
          </FormItem>

          <FormItem label="详细描述：" {...formItemLayout}>
            <div>
              <Editor
                wrapperStyle={{
                  minHeight: 500,
                  maxHeight: 500
                }}
                editorStyle={{
                  minHeight: 376,
                  maxHeight: 376
                }}
                editorState={editorContent}
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                  options: ['inline', 'list', 'colorPicker', 'link', 'emoji', 'image'],
                }}
              />
            </div>
          </FormItem>

          <FormItem wrapperCol={{span: 14, offset: 10}} labelCol={{span: 6}}>
            <Button type="primary" htmlType="submit">保存修改</Button>
          </FormItem>
        </Form>
        {modalVisible && <Modal {...modalProps} />}
      </div>
    </Page>
  )
}

ModuleDetail.propTypes = {
  moduleInfo: PropTypes.object,
}

export default connect(({ moduleInfo, loading }) => ({ moduleInfo, loading }))(Form.create()(ModuleDetail))
