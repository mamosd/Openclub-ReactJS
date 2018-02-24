import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';

import './Terms.scss'

class Terms extends Component {
  static propTypes = {
    frameUrl: PropTypes.string,
    content: PropTypes.string,
    text: PropTypes.string,
    input: PropTypes.object,
    required: PropTypes.bool
  }
  render() {
    const { text, frameUrl, content, input, required } = this.props;
    return (
      <div>
        {frameUrl ? <iframe src={frameUrl} className="legal-doc" /> : <div dangerouslySetInnerHTML={{ __html: content }} className="legal-doc-content" />}
        <Checkbox {...input} required={required} size="large">{text}</Checkbox><br />
        <small>Your IP address and session data will be logged when you accept these terms.</small>
      </div>
    )
  }
}
export default Terms;
