const { config } = require('./common')

const { apiPrefix } = config
let database = [
  {
    id: '1',
    name: '仪表盘',
    icon: 'laptop',
    route: '/cityDashboard'
  },
  {
    id: '2',
    bpid: '1',
    name: '城市管理',
    icon: 'home',
    route: '/city',
  },
  {
    id: '10',
    bpid: '1',
    name: '组件管理',
    icon: 'api',
    route: '/moduleManagement'
  },
  {
    id: '11',
    bpid: '1',
    name: '大数据平台',
    icon: 'dot-chart'
  },
  {
    id: '111',
    bpid: '11',
    mpid: '11',
    name: '信息采集分析平台',
    icon: 'copy',
    route: '/data/actionMonitor'
  },
  {
    id: '112',
    bpid: '11',
    mpid: '11',
    name: '服务实时监控平台',
    icon: 'exception',
    route: '/data/serviceMonitor'
  },
  {
    id: '12',
    bpid: '1',
    name: '人员管理',
    icon: 'man',
    route: '/person'
  },
  {
    id: '14',
    bpid: '1',
    name: '电视影音',
    icon: 'bulb',
    route: '/media'
  },
  {
    id: '21',
    mpid: '-1',
    bpid: '2',
    name: '城市信息',
    route: '/city/:id',
  },
  {
    id: '101',
    mpid: '-1',
    bpid: '10',
    name: '组件信息',
    route: '/module/:id',
  },
  {
    id: '22',
    mpid: '-1',
    bpid: '2',
    name: '应用管理',
    route: '/application/:id',
  },
  {
    id: '13',
    bpid: '1',
    name: 'UI Element',
    route: '/UIElement'
  },
  {
    id: '131',
    bpid: '13',
    mpid: '13',
    name: 'iconfont',
    route: '/UIElement/iconfont',
  },
  {
    id: '132',
    bpid: '13',
    mpid: '13',
    name: 'search',
    route: '/UIElement/search',
  },
  {
    id: '136',
    bpid: '13',
    mpid: '13',
    name: 'editor',
    route: '/UIElement/editor',
  },
  {
    id: '137',
    bpid: '13',
    mpid: '13',
    name: 'dataTable',
    route: '/UIElement/dataTable',
  },
  {
    id: '138',
    bpid: '13',
    mpid: '13',
    name: 'layer',
    route: '/UIElement/layer',
  },
  {
    id: '139',
    bpid: '13',
    mpid: '13',
    name: 'dropOption',
    route: '/UIElement/dropOption',
  }
]

module.exports = {

  [`GET ${apiPrefix}/menus`] (req, res) {
    res.status(200).json(database)
  },
}
