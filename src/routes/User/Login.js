import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Tabs, Button, Icon, Alert } from 'dtd';
import styles from './Login.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(state => ({
  login: state.login,
}))
@Form.create()
export default class Login extends Component {
  state = {
    type: 'tyin',
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onSwitch = (type) => {
    this.setState({ type });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          this.props.dispatch({
            type: 'login/login',
            payload: {
              ...values,
            },
          });
        }
      }
    );
  }

  renderMessage = (message) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={message}
        type="error"
        showIcon
      />
    );
  }

  render() {
    const { form, login } = this.props;
    const { getFieldDecorator } = form;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <Tabs animated={false} className={styles.tabs} activeKey={type} onChange={this.onSwitch}>
            <TabPane tab="账号密码登录" key="tyin">
              {
                login.status === 'error' &&
                login.type === 'tyin' &&
                login.submitting === false &&
                this.renderMessage('账号或密码错误')
              }
              <FormItem>
                {getFieldDecorator('account', {
                  rules: [{
                    required: type === 'tyin', message: '请输入账号',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="user" className={styles.prefixIcon} />}
                    placeholder="请输入账号"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('passwd', {
                  rules: [{
                    required: type === 'tyin', message: '请输入密码！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="lock" className={styles.prefixIcon} />}
                    type="password"
                    placeholder="请输入密码"
                  />
                )}
              </FormItem>
            </TabPane>
          </Tabs>
          <FormItem className={styles.additional}>
            <Button size="large" loading={login.submitting} className={styles.submit} type="primary" htmlType="submit">
              登录
            </Button>
          </FormItem>
        </Form>
        <div className={styles.other}>
          {/* 其他登录方式 */}
          {/* <Link className={styles.register} to={URL_PATH.userRegPage}>注册账户</Link> */}
        </div>
      </div>
    );
  }
}
