import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ContentArea } from 'components/layout';

class LocationWidget extends Component {
  static propTypes = {
    location: PropTypes.object
  }
  render() {
    return (
      <ContentArea>
        MAP
      </ContentArea>
    );
  }
}
export default LocationWidget;
