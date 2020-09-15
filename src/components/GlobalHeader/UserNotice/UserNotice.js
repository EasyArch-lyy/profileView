import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tag } from 'dtd';
import groupBy from 'lodash/groupBy';
import moment from 'moment/moment';
import PropTypes from 'prop-types';

import NoticeIcon from 'Components/NoticeIcon';

import styles from './index.less';

const NOT_READ_STATUS = 0;
const READ_STATUS = 1;

class UserNotice extends PureComponent {
  static propTypes = {
    currentUser: PropTypes.object,
    unReadNotices: PropTypes.array,
    readNotices: PropTypes.array,
    unReadCount: PropTypes.number,
    className: PropTypes.string,
  };

  static defaultProps = {
    currentUser: {},
    unReadNotices: [],
    readNotices: [],
    unReadCount: 0,
    className: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      fetchingNotices: false,
    };
  }

  componentDidMount() {
    const { currentUser } = this.props;

    // if (currentUser && currentUser.id) {
    if (currentUser && currentUser.id1) {
      this.setState({ // eslint-disable-line
        fetchingNotices: true,
      });

      const promiseList = [
        this.props.dispatch({
          type: 'notice/fetchNotices',
          payload: {
            ownerId: currentUser.id,
            status: NOT_READ_STATUS,
            offset: 0,
            limit: 999,
          },
        }).then(() => {
          this.props.dispatch({
            type: 'notice/fetchNotices',
            payload: {
              ownerId: currentUser.id,
              status: READ_STATUS,
              offset: 0,
              limit: 999,
            },
          });
        }),
      ];

      Promise.all(promiseList).then(() => {
        this.setState({
          fetchingNotices: false,
        });
      });
    }
  }

  onNoticeClear = (title) => {
    if (title === '未读') {
      const { currentUser, unReadNotices } = this.props;
      if (currentUser && currentUser.id && unReadNotices.length > 0) {
        this.props.dispatch({
          type: 'notice/postNoticeRead',
          payload: {
            ids: unReadNotices.map(item => item.id),
            ownerId: currentUser.id,
          },
        }).then(() => {
          // 全部标记为已读
          this.props.dispatch({
            type: 'notice/changeAllToReadNotices',
          });
        });
      }
    }
  };

  onItemClick = (item) => {
    if (item.status === NOT_READ_STATUS) {
      const { currentUser } = this.props;
      if (currentUser && currentUser.id) {
        this.props.dispatch({
          type: 'notice/postNoticeRead',
          payload: {
            ids: [
              item.id,
            ],
            ownerId: currentUser.id,
          },
        }).then(() => {
          this.props.dispatch({
            type: 'notice/changeToReadNotices',
            payload: item,
          });
        });
      }
    }
  };

  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status];
        newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  render() {
    const { unReadCount, readNotices, unReadNotices, className } = this.props;

    const { fetchingNotices } = this.state;

    return (
      <NoticeIcon
        className={`${className} ${styles.account}`}
        count={unReadCount}
        onItemClick={this.onItemClick}
        onClear={this.onNoticeClear}
        loading={fetchingNotices}
        popupAlign={{ offset: [20, -16] }}
      >
        <NoticeIcon.Tab
          list={unReadNotices}
          title="未读"
          emptyText="你已查看所有未读通知"
          clearText="全部标记为已读"
          emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
        />
        <NoticeIcon.Tab
          list={readNotices}
          title="已读"
          emptyText="您已读完所有消息"
          // clearText="清空已读"
          emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
        />
      </NoticeIcon>
    );
  }
}

export default connect(state => ({
  currentUser: state.user.currentUser,
  // unReadNotices: state.notice.unReadNotices,
  // unReadCount: state.notice.unReadCount,
  // readNotices: state.notice.readNotices,
}))(UserNotice);
