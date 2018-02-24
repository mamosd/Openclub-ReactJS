import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Category from './Category';
import './CategoryCarousel.scss'

class CategoryCarousel extends Component {
  static propTypes = {
    categories: PropTypes.array
  }
  render() {
    const { categories } = this.props;
    return (
      <div className="category-carousel">
        <div className="category-container">
          {categories.map(cat => <Category key={cat.type} {...cat} />)}
        </div>
      </div>
    )
  }
}
export default CategoryCarousel;
