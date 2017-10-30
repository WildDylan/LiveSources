import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card, Icon, Button } from 'antd'
import { color } from 'utils'
import { Page } from 'components'
import { NumberCard } from './components'
import styles from './index.less'

function CityDashboard ({ cityDashboard, loading }) {
  const { cityS, spin } = cityDashboard

  const cityInfo = (items, id) => {
    return items.map((item, key) => (
      <Col key={key} lg={6} md={12}>
        <NumberCard {...item} id={id} index={key}/>
      </Col>
    ))
  }

  const manageCityApplication = (event) => {
    const id = event.target.getAttribute("data-id")
    alert(id)
  }

  const numberCitys = cityS.map((item, key) => (
    <Row key={key} gutter={24} {...style}>
      <div {...menuStyle}>
        <div>
          <Icon spin={spin} type="appstore-o" />
          <span {...insetStyle}>{item['name']}</span>
        </div>
        <Button onClick={manageCityApplication} {...menuButtonRightStyle} data-id={item['id']}>
          城市应用管理<Icon type="right" />
        </Button>
      </div>
      { cityInfo(item['numbers'], item['id']) }
    </Row>
  ))

  return (
    <Page loading={loading.effects['cityDashboard/query']}>
      {numberCitys}
    </Page>
  )
}

CityDashboard.propTypes = {
  cityDashboard: PropTypes.object,
  loading: PropTypes.object,
}

const style = {
  style: {
    background: color.white,
  }
}

const menuStyle = {
  style: {
    fontSize: '14px',
    marginBottom: '5px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}

const insetStyle = {
  style: {
    paddingLeft: '5px'
  }
}

const menuButtonRightStyle = {
  style: {
    backgroundColor: '#f8f8f8',
    border: '0px'
  }
}

export default connect(({ cityDashboard, loading }) => ({ cityDashboard, loading }))(CityDashboard)
