import React, { Component } from 'react';
import { connect } from 'dva';
import { Select, Table, Input, Divider } from 'dtd';
import TopTitle from 'Components/TopTitle';
import AuthEditForm from './AuthEditForm';

const { Search } = Input;
const { Option } = Select;
@connect(state => ({
  currentUser: state.login.currentUser,
  userList: state.login.userList,
  userInfo: state.user.userInfo,
}))
class userManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectName: '',
    };
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    this.props.dispatch({
      type: 'user/searchUsers',
      payload: {
        account: '',
        name: '',
      }
    });
  }

  // form变量
  saveFormRef = (form) => {
    this.form = form;
  }

  changeSelect=(value) => {
    this.setState({
      selectName: value,
    });
  }

  onAuthFormClose = () => {
    this.props.dispatch({
      type: 'user/changeAuthShowForm',
      payload: {
        isAuthFormShow: false,
        record: {},
      }
    });
  }

  onAuthFormSave = () => {
    const { userInfo } = this.props;
    this.form.validateFields((err, values) => {
      if (!err) {
        let value = { ...values };
        value = {
          id: userInfo.id,
          role: value.role,
        };
        this.props.dispatch({
          type: 'user/changeAuthority',
          payload: {
            ...value,
          },
          callback: () => {
            this.fetch();
            this.onAuthFormClose();
          }
        });
      }
    })
  }

  render() {
    const { userList, isAuthFormShow } = this.props;
    const columns = [{
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      width: '',
    }, {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: '',
      render: (text, record) => {
        let roleName = '';
        if (record.role == 2) {
          roleName = '普通用户';
        } else if (record.role == 1) {
          roleName = '管理员';
        }
        return (
          <span> {roleName} </span>
        );
      },
    }, {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      width: '',
      render: (text, record) => {
        return (
          <span>
            <a onClick={() => this.onChangeAuthorityEdit(record)}>更改授权</a>
            <Divider type="vertical" />
          </span>
        );
      },
    }];
    return (
      <div>
        <TopTitle title="用户管理" />
        <div>
          <Select defaultValue="name" onChange={this.changeSelect}>
            <Option value="name">用户名</Option>
            <Option value="account">账号</Option>
          </Select>
        </div>
        <br />
        <Table
          dataSource={userList}
          columns={columns}
          loading={this.state.loading}
        />
        {isAuthFormShow ? (
          <AuthEditForm
            key="AuthEditForm"
            ref={this.saveFormRef}
            handleCancel={this.onAuthFormClose.bind(this)}
            handleOk={this.onAuthFormSave.bind(this)}
          />
        ) : null}
      </div>
    )
  }
}
