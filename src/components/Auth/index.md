---
title:
  en-US: Auth
  zh-CN: Auth
subtitle: 权限
cols: 1
order: 15
---

权限组件，通过比对现有权限与准入权限，决定相关元素的展示。

## API

### Auth.Authorized

HOC组件, 最基础的权限控制。如果有权限, 则显示```children```, 否则显示onMatch指定的组件, 如果onMatch未指定, 则不显示. 鉴权的数据源来自```user```modal的```permissionIds```.

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| children    | 正常渲染的元素，权限判断通过时展示           | ReactNode  | null |
| authority   | 准入权限/权限判断, 如果是string则继续匹配         | string | array | [] |
| noMatch     | 权限异常渲染元素，权限判断不通过时展示        | ReactNode  | null |
| oneOf     | 是否指定其一, 默认只要 authority 中有个存在则权限通过       | Boolean  | true |
| needLogin     | 鉴权前是否必须登录       | Boolean  | true |


### Auth.AuthorizedRoute

HOC组件, 对Route的再包裹, 使用时只需要替换 ```<Route>``` -> ```<AuthorizedRoute>```, 在加上权限判断即可.

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| authority   | 准入权限/权限判断, 如果是string则继续匹配         | string | array | [] |
| redirectPath  | 权限异常时重定向的页面路由                | string  | - |
| oneOf     | 是否指定其一, 默认只要 authority 中有个存在则权限通过       | Booelan  | true |
| needLogin     | 鉴权前是否必须登录       | Boolean  | true |

其余参数与 `Route` 相同。

### Auth.check

函数形式的 Authorized，用于某些不能被 HOC 包裹的组件, 用于在JS中手动控制。 `Authorized.check(authority, target, Exception, oneOf)`  

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| authority   | 准入权限/权限判断, 如果是string则继续匹配         | string | array | [] |
| target     | 权限判断通过时渲染的元素         | string | ReactNode  | boolean | true |
| noMatch     | 权限异常时渲染元素         | string | ReactNode  | boolean | false |
| oneOf     | 是否指定其一, 默认只要 authority 中有个存在则权限通过       | Booelan  | true |
| needLogin     | 鉴权前是否必须登录       | Boolean  | true |



## Demo

```js

import Auth from '../../component/Auth'
const {Authorized, AuthorizedRoute, check} = Auth

export default class Demo extends React.Component {
  render() {
    const {
      match,
      routerData,
    } = this.props;

    const noMatch = <Button>noMatch  Button</Button>;

    return (
      <Card>
        <div>
          <Authorized authority={['60001']}>
            <div>Authorized yes</div>
          </Authorized>

          <Authorized
            noMatch={noMatch}
            authority={['60099']}
          >
            <div>Authorized no</div>
          </Authorized>
        </div>

        <Switch>
          {
            getRoutes(match.path, routerData).map(item =>
              (
                <AuthorizedRoute
                  authority={['60001']}
                  redirectPath="/exception/403"
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              )
            )
          }
          <Redirect exact from="/org/org_orgs" to="/org/org_orgs/org_list" />
          <Redirect exact from="/org/org_auth" to="/org/org_auth/org_role" />
          <Route render={NotFound} />
        </Switch>
      </Card>
    );
  }
}
```
