import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentPage from 'components/layout/ContentPage'
import { Row, Col, Button } from 'antd'
import CategoryCarousel from 'components/category_carousel'
import { defaultCategories } from 'constants/index'

import './Landing.scss'

class DiscoverLanding extends Component {
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
            <h4>Discover</h4>
          </Col>
          <Col span={4}>
            Search
          </Col>
        </Row>
        <div className="bottom-gap-large" />
        <CategoryCarousel categories={defaultCategories} />
        <hr />
      </ContentPage>
    )
  }
}
export default DiscoverLanding
