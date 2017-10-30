import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  })

  const routes = [
    {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    },
    {
      path: '/UIElement/iconfont',
      component: () => import('./routes/UIElement/iconfont/'),
    }, {
      path: '/UIElement/search',
      component: () => import('./routes/UIElement/search/'),
    }, {
      path: '/UIElement/dropOption',
      component: () => import('./routes/UIElement/dropOption/'),
    }, {
      path: '/UIElement/layer',
      component: () => import('./routes/UIElement/layer/'),
    }, {
      path: '/UIElement/dataTable',
      component: () => import('./routes/UIElement/dataTable/'),
    }, {
      path: '/UIElement/editor',
      component: () => import('./routes/UIElement/editor/'),
    },
    // 城市生活
    {
      path: '/cityDashboard',
      models: () => [import('./models/cityDashboard')],
      component: () => import('./routes/cityDashboard')
    },
    // 城市管理
    {
      path: '/city',
      models: () => [import('./models/city')],
      component: () => import('./routes/city')
    },
    // 城市详情
    {
      path: '/city/:id',
      models: () => [import('./models/city/detail')],
      component: () => import('./routes/city/detail/'),
    },
    // 应用详情
    {
      path: '/application/:id',
      models: () => [import('./models/city/application')],
      component: () => import('./routes/city/application/'),
    },
    // 组件管理
    {
      path: '/moduleManagement',
      models: () => [import('./models/moduleManagement/moduleManagement')],
      component: () => import('./routes/moduleManagement')
    },
    // 组件详情
    {
      path: '/module/:id',
      models: () => [import('./models/moduleManagement/detail')],
      component: () => import('./routes/moduleManagement/detail/'),
    },
    // 大数据平台-信息采集分析
    {
      path: '/data/actionMonitor',
      models: () => [import('./models/data/actionMonitor')],
      component: () => import('./routes/data/actionMonitor')
    },
    // 大数据平台-服务监控告警
    {
      path: '/data/serviceMonitor',
      models: () => [import('./models/data/serviceMonitor')],
      component: () => import('./routes/data/serviceMonitor')
    },
    // 人员管理
    {
      path: '/person',
      models: () => [import('./models/person')],
      component: () => import('./routes/person')
    },
    {
      path: '/media',
      models: () => [import('./models/media')],
      component: () => import('./routes/media')
    }
  ]

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/cityDashboard" />)} />
          {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
          <Route component={error} />
        </Switch>
      </App>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
