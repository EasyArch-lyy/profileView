const proxy = {
  // 测试服务器
  'POST /vmp': 'http://10.160.0.37:8082',
  'GET /vmp': 'http://10.160.0.37:8082',
  'PUT /vmp': 'http://10.160.0.37:8082',
  'DELETE /vmp': 'http://10.160.0.37:8082',
}

const mock = {

}

export default (process.env.PROXY === 'true') ? proxy: mock;
