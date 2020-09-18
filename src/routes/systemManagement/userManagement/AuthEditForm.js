import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, FormItem, Input, Form, Radio } from 'dtd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@connect(state => ({
  isAuthFormShow: state.user.isAuthFormShow,
  record: state.user.userInfo,
}))
class AuthEditForm extends Component {
  render() {
    const { isAuthFormShow, handleOk, handleCancel, record } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 18 },
      },
    };

    const commonFormItem = (
      <Form layout="horizontal">
        <FormItem
          {...formItemLayout}
          label="用户名"
        >
          {getFieldDecorator('name', {
            initialValue: record ? record.name : null,
          })(<Input disabled />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="角色"
        >
          {getFieldDecorator('role_id', {
            rules: [
              { required: true, message: '请选择角色!' },
            ],
            initialValue: record ? record.role_id.toString() : null,
          })(
            <RadioGroup>
              <Radio value="2">管理员</Radio>
              <Radio value="1">普通用户</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    );
    return (
      <Modal
        title="用户管理>更改授权"
        visible={isAuthFormShow}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}
        maskClosable={false}
      >
        {commonFormItem}
      </Modal>
    );
  }
}

const WrappedModuleForm = Form.create()(AuthEditForm);
export default WrappedModuleForm;
