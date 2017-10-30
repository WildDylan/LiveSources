import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import { connect } from 'dva'
import { Page } from 'components'

function MediaBoard ({ dispatch, mediaModule, loading }) {
  return (
    <Page inner>
    </Page>
  )
}

MediaBoard.propTypes = {
  mediaModule: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ mediaModule, loading }) => ({ mediaModule, loading }))(MediaBoard)
