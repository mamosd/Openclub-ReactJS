import React, { Component } from 'react'
import { Upload, message, Button, Icon } from 'antd'
import './FileUploader.scss'

class FileUploader extends Component {
  constructor(props) {
    super(props)
    const { input } = this.props
    this.state = {
      fileList: []
    }
    if(input.value){
      this.state.fileList.push({
        uid: 1,
        url: input.value,
        name: input.value
      })
    }
  }

  handleChange = ({ fileList }) => {
    // enforce only single file selection
    fileList = fileList.slice(-1)
    if(fileList.length > 0 && fileList[0].response){
      this.props.input.onChange(fileList[0].response.token)
    }
    this.setState({
      fileList: fileList
    })
  }

  render() {
    const { input, postname, token, multiple, ...rest } = this.props
    const { fileList } = this.state

    // add jwt header if token supplied
    const headers = token ? {
      'Authorization': `Bearer ${token}`
    } : {}

    const uploadButtonText = (fileList.length > 0)
      ? 'Change File Selection'
      : `Click to choose ${multiple ? 'files' : 'file'}`

    return (
      <Upload
        {...input}
        name={postname}
        token={token}
        headers={headers}
        showRemoveIcon={false}
        fileList={fileList}
        {...rest}
        onChange={this.handleChange}
      >
        <Button size="large">
          <Icon type="upload" /> {uploadButtonText}
        </Button>
      </Upload>
    )
  }
}

export default FileUploader
