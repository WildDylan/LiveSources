const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

const DATA_API_V1 = '/modularize/api/v1'

module.exports = {
  name: 'YiDu Modularize',
  prefix: 'modularizeAdmin',
  secret: 'kbZct1uP',
  footerText: 'YiDu Modularization Admin  © 2017 dylan',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: [],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  DATA_API_V1,
  api: {
    userLogin: `${APIV1}/user/login`,
    userLogout: `${APIV1}/user/logout`,
    userInfo: `${APIV1}/userInfo`,
    users: `${APIV1}/users`,
    posts: `${APIV1}/posts`,
    user: `${APIV1}/user/:id`,
    dashboard: `${APIV1}/dashboard`,
    menus: `${APIV1}/menus`,
    weather: `${APIV1}/weather`,
    v1test: `${APIV1}/test`,
    v2test: `${APIV2}/test`,
  },
  dataApi: {
    cityDashboard: `${DATA_API_V1}/cityDashboard.do`,
    cityModule: `${DATA_API_V1}/cityModule.do`,
    cityInfo: `${DATA_API_V1}/cityInfo.do`,
    createCity: `${DATA_API_V1}/createCity.do`,
    allUserInfo: `${DATA_API_V1}/allUserInfo.do`,
    cityManagerUpdate: `${DATA_API_V1}/updateCityManager.do`,
    queryCityApplication: `${DATA_API_V1}/queryCityApplication.do`,
    userInfoWithId: `${DATA_API_V1}/queryUserWithId.do`,
    updateUserInfo: `${DATA_API_V1}/updateUser.do`,
    createNewUser: `${DATA_API_V1}/createUser.do`,
    createApplication: `${DATA_API_V1}/createApplication.do`,
    moduleListAPI: `${DATA_API_V1}/moduleList.do`,
    createNewModuleAPI: `${DATA_API_V1}/createModule.do`,
    queryModuleAPI: `${DATA_API_V1}/queryModule.do`,
    updateModuleInfoAPI: `${DATA_API_V1}/updateModule.do`
  }
}
