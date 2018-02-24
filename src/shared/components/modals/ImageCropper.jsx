import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd'
import { connectModal } from 'redux-modal'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

class ImageCropper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      crop: {
        x: 5,
        y: 0,
        width: 90
      }
    }

    this.cropCompleted = this.cropCompleted.bind(this);
    this.imageLoaded = this.imageLoaded.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  cropCompleted(crop) {
    this.setState({ crop })
  }

  imageLoaded(crop) {
    this.setState({ crop })
  }

  async handleOk(oker, hider) {
    await oker(this.state.crop)
    hider()
  }

  handleCancel(canceller, hider) {
    canceller()
    hider()
  }

  render() {
    console.log(this.state);
    const { show, handleHide, onResult, onCancel, src } = this.props

    return (
      <Modal
        title="Adjust Image" cancelText="Cancel" okText="OK" maskClosable={false}
        visible={show} onOk={this.handleOk.bind(this, onResult, handleHide)} onCancel={this.handleCancel.bind(this, onCancel, handleHide)}
      >
        <ReactCrop
          src={src}
          crop={{
            ...this.state.crop,
            aspect: this.props.aspect ? this.props.aspect : 1
          }}
          onComplete={this.cropCompleted}
          onImageLoaded={this.imageLoaded}
        />
      </Modal>
    )
  }
}

export default connectModal({ name: 'imagecropper', destroyOnHide: true })(ImageCropper)
