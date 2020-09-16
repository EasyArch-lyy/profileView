const proxy = {
  // 测试服务器
  'POST /SPL': 'http://10.160.0.37:8001',
  'GET /SPL': 'http://10.160.0.37:8001',
  'PUT /SPL': 'http://10.160.0.37:8001',
  'DELETE /SPL': 'http://10.160.0.37:8001',
  '/api/session/*': 'http://192.168.1.100:8080',
  '/user/login/*': 'http://10.160.0.37:8081',
}
import { API_PATH } from './src/common/path'

import {
  getAutoTestTaskInfoList,
  getTableData,
} from './mock';
// nvocation failed Server returned invalid Response. java.lang.RuntimeException: Invocation failed Server returned invalid Response. at org.jetbrains.git4idea.http.GitAskPassXmlRpcClient.askUsername(GitAskPassXmlRpcClient.java:50) at org.jetbrains.git4idea.http.GitAskPassApp.main(GitAskPassApp.java:64) Caused by: java.io.IOException: Server returned invalid Response. at org.apache.xmlrpc.LiteXmlRpcTransport.sendRequest(LiteXmlRpcTransport.java:242) at org.apache.xmlrpc.LiteXmlRpcTransport.sendXmlRpc(LiteXmlRpcTransport.java:90) at org.apache.xmlrpc.XmlRpcClientWorker.execute(XmlRpcClientWorker.java:72) at org.apache.xmlrpc.XmlRpcClient.execute(XmlRpcClient.java:194) at org.apache.xmlrpc.XmlRpcClient.execute(XmlRpcClient.java:185) at org.apache.xmlrpc.XmlRpcClient.execute(XmlRpcClient.java:178) at org.jetbrains.git4idea.http.GitAskPassXmlRpcClient.askUsername(GitAskPassXmlRpcClient.java:47) ...
// 1 more remote: No anonymous write access. Authentication failed for 'https://github.com/EasyArch-lyy/profileView.git/'
const mock = {
// 支持值为 Object 和 Array
//   'GET /api/currentUser': {
//     $desc: "获取当前用户接口",
//     $params: {
//       pageSize: {
//         desc: '分页',
//         exp: 2,
//       },
//     },
//     $body: {
//       name: 'DtDream',
//       avatar: 'rmsportal/.png',
//       userid: '00000001',
//       notifyCount: 12,
//     },
//   },
//   'POST /login/account': (req, res) => {
//     const { account, passwd, type } = req.body;
//     res.send({
//       status: passwd === '888888' && account === '123456' ? 'ok' : 'error',
//       type,
//     });
//   },
//   'POST /login/register': (req, res) => {
//     res.send({ status: 'ok' });
//   },
//   [`GET ${API_PATH.demoTable}`]: getTableData,
//   [`GET ${API_PATH.getAutoTestTaskInfoList}`]: getAutoTestTaskInfoList,
}

export default (process.env.PROXY === 'true') ? proxy: mock;
