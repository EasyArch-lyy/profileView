import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Spin } from 'dtd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Redirect, Route, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { getPageTitle } from 'Common/router';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import { AuthorizedRoute, getFirstAuthorizedPath } from '../components/Auth';

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      firstAuthorizedPath: '',
      loading: false,
    };
  }
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }
  componentDidMount() {
    this.fetch();
  }
  fetch=() => {
    this.setState({ loading: true });
    this.props.dispatch({
      type: 'login/fetchCurrent',
    }).then(() => {
      this.setState({
        firstAuthorizedPath: getFirstAuthorizedPath(),
        loading: false,
      });
    });
  }
  render() {
    const {
      currentUser, collapsed, fetchingNotices, notices, routerData, match, location, dispatch, status,
    } = this.props;
    const { loading } = this.state;
    const layout = (
      <Layout>
        <SiderMenu
          collapsed={collapsed}
          location={location}
          dispatch={dispatch}
        />
        <Layout>
          <GlobalHeader
            currentUser={currentUser}
            fetchingNotices={fetchingNotices}
            notices={notices}
            collapsed={collapsed}
            dispatch={dispatch}
            location={location}
          />
          <Content
            style={{
              padding: '24px 24px 0px',
              height: 'calc(100vh - 60px)',
              overflow: 'auto',
              backgroundColor: '#fff',
            }}
          >
            <div style={{ minHeight: 'calc(100vh - 200px)' }}>
              <Switch>
                {
                  getRoutes(match.path, routerData).map(item =>
                    (
                      <AuthorizedRoute
                        authority={item.authority}
                        redirectPath="/exception/403"
                        key={item.key}
                        path={item.path}
                        component={item.component}
                        exact={item.exact}
                      />
                    )
                  )
                }
                {
                  this.state.firstAuthorizedPath && <Redirect exact from="/" to={this.state.firstAuthorizedPath} />
                }
                <Route render={NotFound} />
              </Switch>
            </div>
            <GlobalFooter />
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <div>
        {status || status === undefined ? (
          <DocumentTitle title={getPageTitle(routerData, location)}>
            <ContainerQuery query={query}>
              {params => <div className={classNames(params)}>{!loading ? layout : <Spin />}</div>}
            </ContainerQuery>
          </DocumentTitle>
      ) : <Redirect exact from="/" to="/user/login" />}
      </div>
    );
  }
}

export default connect(state => ({
  currentUser: state.login.currentUser,
  currentProduct: state.login.currentProduct,
  status: state.login.status,
  collapsed: state.global.collapsed,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
}))(BasicLayout);
