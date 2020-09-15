import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col } from 'dtd';
import Styles from './index.less';

const FormItem = Form.Item;

@connect(state => ({
  CaseData: state.testCase.CaseData,
}))
class Detail extends Component {
  render() {
    const { CaseData, detail } = this.props;
    const oData = detail ? { ...detail } : { ...CaseData };
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const formItemLayoutHalf = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    };

    const getFormItem = (item) => {
      if ((item.isJudge && !item.title) || (detail && item.isNotCaseRelate) || (!detail && item.isCaseRelate)) {
        return null;
      }
      const Layout = item.isHalf ? formItemLayoutHalf : formItemLayout;
      return (
        <Col span={item.isHalf ? 12 : 24}>
          <FormItem
            {...Layout}
            label={item.label}
          >
            {item.isHtml ? (
              <p dangerouslySetInnerHTML={{ __html: item.title }} />
            ) : <p>{item.title}</p>}
          </FormItem>
        </Col>
      );
    };

    const changeTitle = (data) => {
      return data && data.split(',').map(item => (<a href={item} target="_blank" rel="noopener noreferrer">{item}</a>));
    };

    const Item = [
      { label: '用例标题', title: oData.title },
      { label: '自定义标签', title: oData.tags },
      { label: '用例类型', title: oData.type, isHalf: true },
      { label: '优先级', title: oData.priority, isHalf: true },
      { label: '用例来源', title: oData.source, isHalf: true },
      { label: '用例页面', title: oData.confluencePageId, isJudge: true, isHalf: true },
      { label: '用例actor', title: oData.actor },
      { label: '预置条件', title: oData.precondition },
      { label: '自动化', title: oData.automate, isJudge: true },
      { label: 'UI自动化脚本', title: oData.uiAutomate ? changeTitle(CaseData.uiAutomate) : '', isJudge: true },
      { label: 'API自动化脚本', title: oData.apiAutomate ? changeTitle(CaseData.apiAutomate) : '', isJudge: true },
      { label: '用例内容', title: oData.content, isHtml: true },
      { label: '用例备注', title: oData.comment, isHtml: true },
      { label: '所属模块', title: oData.module, isCaseRelate: true },
      { label: '责任人', title: oData.importCaseUser, isNotCaseRelate: true },
      { label: '责任人', title: oData.duty_person, isCaseRelate: true },
      {
        label: '创建时间',
        title: oData.createDate ? moment(oData.createDate).format('YYYY-MM-DD') : '',
        isHalf: true,
        isNotCaseRelate: true,
      },
      { label: '更新时间',
        title: oData.updateDate ? moment(oData.updateDate).format('YYYY-MM-DD') : '',
        isHalf: true,
        isNotCaseRelate: true,
      },
      {
        label: '更新时间',
        isCaseRelate: true,
        title: oData.update_time ? moment(oData.update_time).format('YYYY-MM-DD hh:mma') : '',
      },
    ];
    return (
      <Form className={Styles.detailForm}>
        <Row gutter={24}>{Item.map(item => getFormItem(item))}</Row>
      </Form>
    );
  }
}

const DetailForm = Form.create()(Detail);
export default DetailForm;
