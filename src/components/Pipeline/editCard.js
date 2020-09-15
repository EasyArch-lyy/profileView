import React, { Component, Fragment } from 'react';
import { Card, Icon, Select, Button, Popconfirm, Radio, message } from 'dtd';
import Styles from './index.less';

const { Option, OptGroup } = Select;
const RadioGroup = Radio.Group;

class EditCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toolIdList: [],
      selectEditTools: {},
      selectAddTools: {},
      radioGroupValue: 'serial',
    };
  }
  componentWillReceiveProps(nextProps) {
    const { data, dataType } = nextProps.ciTemplatePipelineCheckNode;
    if (nextProps.ciTemplatePipelineCheckNode !== this.props.ciTemplatePipelineCheckNode && data) {
      this.handleSelectChange(data.toolId, 0, dataType);
    }
    if (nextProps.pipeline !== this.props.pipeline) {
      const toolIdList = [];
      this.changeToolIdList(nextProps.pipeline, toolIdList);
      this.setState({ toolIdList });
    }
  }
  changeToolIdList=(pipeline, toolIdList) => {
    if (pipeline) {
      const { nodeOrNodeList, nodeList, toolId } = pipeline;
      if (nodeOrNodeList === 'nodeList') {
        nodeList.forEach(item => this.changeToolIdList(item, toolIdList));
      } else {
        toolIdList.push(toolId);
      }
    }
  }
  handleSelectChange=(selectTool, a, type) => {
    const dataType = type || this.props.ciTemplatePipelineCheckNode.dataType;
    const { ciToolsList } = this.props;
    let tools = [];
    Object.keys(ciToolsList).forEach((element) => {
      const list = ciToolsList[element];
      tools = [...tools, ...list];
    });
    if (dataType === 'node') {
      this.setState({ selectEditTools: tools.filter(item => item.id === selectTool)[0] });
    } else if (selectTool) {
      this.setState({ selectAddTools: tools.filter(item => item.id === selectTool)[0] });
    } else {
      this.setState({ selectAddTools: {} });
    }
  }
  onRadioGroupChange = (e) => {
    this.setState({
      radioGroupValue: e.target.value,
    });
  }
  handleCardSave=() => {
    const { ciTemplatePipelineCheckNode, onPipelineCardEdit, onPipelineCardAdd } = this.props;
    const { dataType } = ciTemplatePipelineCheckNode;
    const { radioGroupValue } = this.state;
    if (dataType === 'node') {
      onPipelineCardEdit(this.state.selectEditTools);
    }
    if (dataType === 'edge' && this.state.selectAddTools.id) {
      onPipelineCardAdd(this.state.selectAddTools, radioGroupValue);
    } else if (dataType === 'edge' && !this.state.selectAddTools.id) {
      message.warn('请选择要添加的节点');
    }
  }
  onDelete=() => {
    const { onHandlePipelineCardDelete } = this.props;
    onHandlePipelineCardDelete(this.state.selectEditTools);
  }
  getEditForm = (selectEditTools) => {
    const { ciToolsList } = this.props;
    const { toolIdList } = this.state;
    const optGroup = Object.keys(ciToolsList).map(item => (
      <OptGroup label={item} key={item}>
        {ciToolsList[item] ?
            ciToolsList[item].map(tool =>
              <Option value={tool.id} key={tool.id} disabled={toolIdList.indexOf(tool.id) >= 0}>{tool.toolName}</Option>
            )
            : null}
      </OptGroup>
    ));
    return (
      <Fragment>
        <div className={Styles.cardEditTitle}>工具</div>
        <Select
          value={selectEditTools ? selectEditTools.id : null}
          onChange={this.handleSelectChange}
        >
          {optGroup}
        </Select>
      </Fragment>
    );
  }
  getAddForm = () => {
    const { selectAddTools } = this.state;
    const { source } = this.props.ciTemplatePipelineCheckNode.data;
    return (
      <Fragment>
        <div className={Styles.cardEditTitle}>类型（基于{source}）</div>
        <RadioGroup onChange={this.onRadioGroupChange} value={this.state.radioGroupValue}>
          <Radio value="serial">串行</Radio>
          <Radio value="parallel">并行</Radio>
        </RadioGroup>
        <div className={Styles.cardOptions}>{this.getEditForm(selectAddTools)}</div>
      </Fragment>
    );
  }
  render() {
    const { selectEditTools } = this.state;
    const { ciTemplatePipelineCheckNode, onCancel } = this.props;
    const { dataType, data } = ciTemplatePipelineCheckNode;
    const cardExtra = (
      <Fragment>
        {dataType === 'node' ? (
          <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete()}>
            <Icon type="delete" className={Styles.cardEditIcon} />
          </Popconfirm>
        ) : null}
        <Icon type="close" className={Styles.cardEditIcon} onClick={() => onCancel({})} />
      </Fragment>
    );
    return (
      dataType ?
        (
          <div className={Styles.cardEdit}>
            <Card
              title={dataType === 'node' ? `编辑：${data.name}` : '新增工具'}
              extra={cardExtra}
              style={{ width: 260 }}
            >
              <div>
                {dataType === 'node' ? this.getEditForm(selectEditTools) : this.getAddForm()}
                <Button
                  type="primary"
                  size="mini"
                  onClick={this.handleCardSave}
                  className={Styles.cardEditSave}
                >确定
                </Button>
              </div>
            </Card>
          </div>
        ) : null
    );
  }
}
export default EditCard;
