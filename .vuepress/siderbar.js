const { createSideBarConfig } = require('./util')
const VUE_PATH = '/blogs/vue'
const JAVASCRIPT_PATH = '/blogs/javascript'


module.exports = {
  [VUE_PATH]: [createSideBarConfig('VUE', VUE_PATH)],
  [JAVASCRIPT_PATH]: [createSideBarConfig('JAVASCRIPT', JAVASCRIPT_PATH)],
}
