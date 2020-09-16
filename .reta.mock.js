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
