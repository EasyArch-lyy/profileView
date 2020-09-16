import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'dtd';
import TopTitle from "../../components/TopTitle";

@connect(state => ({
  profileList: state.profile.profileList,
}))

class profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  fetch = () => {
    this.props.dispatch({
      type: 'getProfile',
    });
  };

  componentDidMount() {
    this.fetch();
  }

  render() {
    const { profileList } = this.props;
    const columns = [{
      title: '编号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '组件名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '组件登录账号',
      dataIndex: 'account',
      key: 'account',
    }, {
      title: '组件登录密码',
      dataIndex: 'passwd',
      key: 'passwd',
    }, {
      title: '组件路径',
      dataIndex: 'path',
      key: 'path',
    }, {
      title: '组件类型',
      dataIndex: 'type',
      key: 'type',
    }, {
      title: '组件占用ip',
      dataIndex: 'ip',
      key: 'ip',
    }, {
      title: '组件占用端口',
      dataIndex: 'port',
      key: 'port',
    }];
    return (
      <div>
        <TopTitle title="服务总览" />
        <br /><br />
        <Table
          rowKey={record => record.projectName}
          dataSource={profileList}
          columns={columns}
          loading={this.state.loading}
        />
      </div>
    )
  }
}
