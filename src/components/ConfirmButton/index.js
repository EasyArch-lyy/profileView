import { Modal, Button } from 'dtd';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Styles from './index.less';

class ConfirmButton extends PureComponent {
  state = { visible: false }
  static propTypes = {
    btnText: PropTypes.string,
    title: PropTypes.string,
    msg: PropTypes.string,
    handleOkFunc: PropTypes.func,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    btnText: '确定',
    title: '',
    msg: '',
    handleOkFunc: this.defultOkFunc,
    loading: false,
  };

  defultOkFunc = () => {
    console.log('');
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.props.handleOkFunc();
    this.setState({
      visible: false,
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  render() {
    return (
      <div className={Styles.topButtonGroup}>
        <Button className={Styles.topButton} type="primary" loading={this.props.loading} onClick={this.showModal}>
          { this.props.btnText}
        </Button>
        <Modal
          title={this.props.title}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>{this.props.msg}</p>
        </Modal>
      </div>
    );
  }
}
export default ConfirmButton;
