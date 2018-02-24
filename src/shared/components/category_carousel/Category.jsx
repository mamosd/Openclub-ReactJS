import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CategoryCard extends Component {
  render() {
    const { type, name, ...rest } = this.props
    return <a {...rest} className={`category-card ${type}`}>{name}</a>
  }
}
export default CategoryCard
