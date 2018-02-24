import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormItem, Input, Icon, Button } from 'antd'
import './NewsFeedComment.scss'

class NewsFeedComment extends Component {
  static propTypes = {
    form: PropTypes.object
  }
  constructor(props) {
    super(props)

    this.state = {
      text: ''
    }

    this.handleInput = this.handleInput.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(e) {
    e.preventDefault()
  }
  handleInput(e) {
    this.setState({
      text: e.target.value
    })
  }
  render() {
    return (
      <div>
        <Form type="inline" onSubmit={this.handleSubmit}>
          <FormItem>
            <Input type="textarea" prefix={<Icon type="message" />} placeholder="Compose your comment..." autosize={{ minRows: 1 }} />
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" disabled>Comment</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default NewsFeedComment;
