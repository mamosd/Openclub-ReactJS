import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/lib/card';
import Modal from 'antd/lib/modal';
import ReactPlayer from 'react-player';
import cx from 'classnames';
import _ from 'lodash';

import './PostAttachment.scss';

class PostAttachment extends Component {
  static propTypes = {
    attachment: PropTypes.object
  }
  constructor(props) {
    super(props);

    this.state = {
      videoModalVisible: false
    }
  }
  openVideo() {
    this.setstate({
      videoModalVisible: true
    })
  }
  closeVideo() {
    this.setState({
      videoModalVisible: false
    })
  }
  formattedContent() {
    const { attachment = {} } = this.props;

    let headline = attachment.headline ? attachment.headline : '';
    let image = (attachment.image && attachment.image.length > 0) ? attachment.image[0].url : '';
    let url = attachment.url || '';
    let description = attachment.description ? attachment.description : '';
    let video = attachment.video && attachment.video.length > 0 ? attachment.video[0].url : '';

    headline = _.get(attachment, 'provider.name', headline);

    return {
      headline,
      image,
      url,
      description,
      video
    }
  }
  onClick(e) {
    const { video } = this.formattedContent();

    if (video) {
      e.preventDefault();

      this.setState({ videoModalVisible: true });
    }
  }
  render() {
    const { headline, image, url, description, video } = this.formattedContent()
    return (
      <Card bodyStyle={{ padding: 0 }}>
        { image ? <div className={cx({ 'post-image': true, 'video': !!video })}>
          <a onClick={this.onClick.bind(this)} href={url} target="_blank" rel="noopener noreferrer" className="post-image-layer" style={{ backgroundImage: `url(${image})`}} />
        </div> : <i className="fa fa-globe link-only" />}
        {video && <Modal
          style={{ top: 20 }}
          wrapClassName="video-modal"
          visible={this.state.videoModalVisible}
          onCancel={this.closeVideo.bind(this)}
          width="auto"
        >
          <ReactPlayer url={url} className="video-player" />
        </Modal>}
        <div className="post-content">
          <div className="post-title"><a href={url} target="_blank" rel="noopener noreferrer">{headline}</a></div>
          <div className="post-description">{description}</div>
          <small className="post-url"><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></small>
        </div>
      </Card>
    );
  }
}
export default PostAttachment;
