import React, { Component } from 'react';
import { Modal } from 'dtd';
import DetailForm from './DetailForm';

class DetailModal extends Component {
  render() {
    const { visible, onEvent } = this.props;
    return (
      <Modal
        title="用例详情"
        visible={visible}
        onOk={onEvent}
        width={700}
        onCancel={onEvent}
      >
        <DetailForm />
      </Modal>
    );
  }
}

export default DetailModal;
