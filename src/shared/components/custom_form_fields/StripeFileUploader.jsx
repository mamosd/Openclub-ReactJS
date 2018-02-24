import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FileUploader } from 'components/form_controls'

class StripeFileUploader extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <FileUploader
        {...this.props}
        />
  }
}
export default StripeFileUploader
