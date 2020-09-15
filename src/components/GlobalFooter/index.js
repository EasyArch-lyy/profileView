import React from 'react';
import classNames from 'classnames';
import { Icon } from 'dtd';
import { FOOT_INFO } from 'Common/const';
import styles from './index.less';

export default ({ className }) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <div className={clsString}>
      <div>
        <Icon type="copyright" /> {`${FOOT_INFO.version} ${FOOT_INFO.copyright}`}
      </div>
    </div>
  );
};
