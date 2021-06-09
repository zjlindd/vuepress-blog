const { createSideBarConfig } = require('./util')
const TEST_PATH = '/blogs/test'
const DEMO_PATH = '/blogs/demo'


module.exports = {
  [TEST_PATH]: [createSideBarConfig('测试', TEST_PATH)],
  [DEMO_PATH]: [createSideBarConfig('demo', DEMO_PATH)],
}
