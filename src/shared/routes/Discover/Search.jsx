import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentPage from 'components/layout/ContentPage'
import { Row, Col, Button } from 'antd'

import './Landing.scss'

class Search extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
  }
  goTo(link) {
    this.context.router.transitionTo(link);
  }
  render() {
    return (
      <ContentPage>
        <Row>
          <Col span={20}>
            <h4>Search</h4>
          </Col>
        </Row>
        <div className="bottom-gap-large" />
        <hr />
      </ContentPage>
    )
  }
}
export default Search
