import React, { Component } from 'react';
import Styles from './index.less';

class Card extends Component {
  render() {
    return (
      <div className={Styles.card}>
        <div className={Styles.header}>{this.props.title}</div>
        <div className={Styles.container}>{this.props.children}</div>
      </div>
    );
  }
}
export default Card;
