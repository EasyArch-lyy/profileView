import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Icon, Table, Menu } from 'dtd';
import CaseDetailModal from './CaseDetailModal';
import Styles from './index.less';

@connect(state => ({
  currentUser: state.login.currentUser,
}))
class CaseTreeCon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedRow: null,
      visible: false,
      currentCase: {},
      detailModalVisible: false,
    };
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    updateSelectedRowKeys: PropTypes.func,
    CaseTree: PropTypes.array,
    isAsync: PropTypes.bool,
    selectedRowKeysModule: PropTypes.array,
    selectedRowKeysCase: PropTypes.array,
    showDelete: PropTypes.bool,
    onExpand: PropTypes.func,
    defaultExpandAllRows: PropTypes.bool,
    rowSelection: PropTypes.bool,
    checkedRowProps: PropTypes.number,
  };

  static defaultProps = {
    updateSelectedRowKeys: null,
    CaseTree: [],
    isAsync: false,
    selectedRowKeysModule: [],
    selectedRowKeysCase: [],
    showDelete: true,
    onExpand: null,
    defaultExpandAllRows: false,
    rowSelection: true,
    checkedRowProps: -1,
  };

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
  }
  componentWillUnmount() {
    // 移除事件监听
    document.removeEventListener('click', this.handleClick);
  }

  handleClick = () => {
    const { visible } = this.state;
    if (visible) {
      this.setState({ visible: false });
    }
  };

  checkLastNode=(parentDecs) => {
    const { CaseTree } = this.props;
    const { selectedRowKeysModule, selectedRowKeysCase } = this.props;
    const select = [...selectedRowKeysModule, ...selectedRowKeysCase];
    const parentDict = { ...parentDecs };
    const keyList = Object.keys(parentDict).sort();
    let record = [...CaseTree];
    let parent = {};
    keyList.forEach((item) => {
      const id = parentDict[item];
      parent = { ...record.filter(i => i.id === id)[0] };
      record = [...parent.children];
    });
    const target = record.filter(item => select.indexOf(item.id) >= 0);
    let result = [parent.id];
    if (target.length <= 1) {
      if (keyList.length > 1) {
        delete parentDict[keyList[keyList.length - 1]];
        const nodeList = this.checkLastNode(parentDict);
        if (nodeList) result = [...result, ...nodeList];
      }
      return result;
    } else return null;
  }

  onSelect=(selected, record) => {
    const { id, children, type, parent } = record;
    let caseModule = [];
    let testase = [];
    if (type > 0) caseModule.push(id);
    else testase.push(id);
    if (selected && parent) caseModule = [...caseModule, ...Object.keys(parent).map(key => parent[key])];
    else if (parent) {
      if (this.checkLastNode(parent, record.id)) {
        caseModule = [...caseModule, ...this.checkLastNode(parent, record.id)];
      }
    }
    if (children && children.length > 0) {
      children.forEach((item) => {
        const { caseModule: m, testase: t } = this.onSelect(selected, item);
        caseModule = [...caseModule, ...m];
        testase = [...testase, ...t];
      });
    }
    return { caseModule, testase };
  }
  onChangeSelect=(selected, record) => {
    const { selectedRowKeysModule, selectedRowKeysCase } = this.props;
    const { updateSelectedRowKeys } = this.props;
    const { caseModule, testase } = this.onSelect(selected, record);
    const selectM = this.getSelectCaseRow(selected, [...selectedRowKeysModule], caseModule);
    const selectC = this.getSelectCaseRow(selected, [...selectedRowKeysCase], testase);
    updateSelectedRowKeys(selectM, selectC);
    this.setState({ checkedRow: record.id });
    // this.setState({ selectedRowKeysCaseModule: selectM, selectedRowKeysTestase: selectC });
  }
  getSelectCaseRow=(selected, stateData, selectData) => {
    let select = [...stateData];
    if (selected) select = [...selectData, ...stateData];
    else select = select.filter(item => selectData.indexOf(item) < 0);
    return select;
  }

  onExpand=(expanded, record, isReFresh = false) => {
    if (expanded && record.type > 0 && (isReFresh || record.children.length <= 0)) {
      this.props.dispatch({
        type: 'testCase/getCaseTreeBase',
        payload: {
          checkbox: 'none',
          isSearch: false,
          moduleID: record.id,
          productID: this.props.match.params.pid,
          record,
          // body: {
          //   keywords: this.state.caseSearchSelect,
          // },
        },
        // callback: response => (callback ? callback(response) : null),
      });
    }
  }

  ContextMenu = (event, record) => {
    // clientX/Y 获取到的是触发点相对于浏览器可视区域左上角距离
    const clickX = event.clientX;
    const clickY = event.clientY;
    event.preventDefault();
    if (record.type === -1) {
      this.setState({
        visible: true,
        currentCase: record,
      }, () => {
        // window.innerWidth/innerHeight 获取的是当前浏览器窗口的视口宽度/高度
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        // 获取自定义菜单的宽度/高度
        const rootW = this.root.offsetWidth;
        const rootH = this.root.offsetHeight;

        // right为true，说明鼠标点击的位置到浏览器的右边界的宽度可以放下菜单。否则，菜单放到左边。
        // bottom为true，说明鼠标点击位置到浏览器的下边界的高度可以放下菜单。否则，菜单放到上边。
        const right = (screenW - clickX) > rootW;
        const left = !right;
        const bottom = (screenH - clickY) > rootH;
        const top = !bottom;

        if (right) {
          this.root.style.left = `${clickX}px`;
        }

        if (left) {
          this.root.style.left = `${clickX - rootW}px`;
        }

        if (bottom) {
          this.root.style.top = `${clickY}px`;
        }
        if (top) {
          this.root.style.top = `${clickY - rootH}px`;
        }
      });
    }
  }

  // 获取用例详情
  getDetail = () => {
    this.props.dispatch({
      type: 'testCase/getCaseData',
      payload: this.state.currentCase.id,
    });
  }

  // 右键删除用例
  deleteCase = (record) => {
    this.props.dispatch({
      type: 'testCaseCreate/deleteAllotDutyPerson',
      payload: {
        id: this.props.taskId,
        caseId: record.id,
      },
    }).then(() => {
      this.props.onCallback(this.props.taskId);
    });
  }

  // 右键查看用例详情
  showDetailModal = () => {
    this.setState({
      detailModalVisible: !this.state.detailModalVisible,
    }, () => {
      if (this.state.detailModalVisible) {
        this.getDetail();
      }
    });
  }

  // 节点点击事件
  onCaseLineClick = (record) => {
    const { onRow } = this.props;
    if (onRow) {
      onRow(record).onClick(record);
    }
    this.setState({ checkedRow: record.id });
  }

  // 鼠标右键
  onContextMenu = (e, record) => {
    const { onRow } = this.props;
    if (onRow && onRow(record).onContextMenu) {
      onRow(record).onContextMenu(e, record);
    } else {
      this.ContextMenu(e, record);
    }
    this.setState({ checkedRow: record.id });
  }

  // 点击展开菜单
  onCaseLineExpand = (expanded, record) => {
    const { isAsync, onExpand } = this.props;
    if (isAsync || onExpand) {
      if (onExpand) {
        onExpand(expanded, record);
      } else {
        this.onExpand(expanded, record);
      }
    }
    this.setState({ checkedRow: record.id });
  }


  render() {
    const { CaseTree, onExpand, defaultExpandAllRows, rowSelection, checkedRowProps } = this.props;
    const { checkedRow, visible, currentCase, detailModalVisible } = this.state;
    const { selectedRowKeysModule, selectedRowKeysCase } = this.props;
    const oRowSelection = rowSelection ? {
      selectedRowKeys: [...selectedRowKeysModule, ...selectedRowKeysCase],
      onSelect: (record, selected, selectedRows) => {
        if (record.type === 1 && record.children.length === 0) {
          (onExpand || this.onExpand)(true, record, false, response =>
            this.onChangeSelect(selected, { ...record, children: JSON.parse(response) }, selectedRows));
        } else {
          this.onChangeSelect(selected, record, selectedRows);
        }
      },
    } : null;
    const columns = [{
      title: '用例',
      dataIndex: 'label',
      key: 'label',
      render: (text, record) => (
        <span>
          {record.type > 0 ? <Icon type="folder" className={Styles.tableTrLineIconFolder} />
        : <Icon type="file" className={Styles.tableTrLineIconFile} />}
          { text} {record.allotPerson}
          {record.allotted ? <Icon type="star" title="主线任务" className={Styles.tableTrLineIconMaster} />
        : null}
        </span>
      ),
    }];
    return (
      <div className={Styles.tableWrapper}>
        { CaseTree && CaseTree.length ?
          (
            <Table
              columns={columns}
              rowSelection={oRowSelection}
              dataSource={CaseTree}
              defaultExpandAllRows={defaultExpandAllRows}
              textEllipsis={{}}
              showHeader={false}
              pagination={false}
              rowKey={record => record.id}
              size="small"
              indentSize={8}
              onExpand={(expanded, record) => this.onCaseLineExpand(expanded, record)}
              rowClassName={record => (checkedRowProps ? (record.id === checkedRowProps ? Styles.checkedRow : '')
                : record.id === checkedRow ? Styles.checkedRow : '')}
              onRow={(record) => {
                return {
                  onClick: () => this.onCaseLineClick(record),
                  onContextMenu: e => this.onContextMenu(e, record),
                };
              }}
            />
          ) : ''
        }
        {
          visible && (
            <div ref={(ref) => { this.root = ref; }} className={Styles['contextMenu-wrap']}>
              <Menu>
                {this.props.showDelete ? (
                  <Menu.Item><span onClick={() => this.deleteCase(currentCase)}>删除用例</span></Menu.Item>) : ''}
                <Menu.Item><span onClick={() => this.showDetailModal()}>查看用例详情</span></Menu.Item>
              </Menu>
            </div>
          )
        }
        <CaseDetailModal
          visible={detailModalVisible}
          currentCase={currentCase}
          onEvent={this.showDetailModal}
        />
      </div>
    );
  }
}

export default withRouter(CaseTreeCon);
