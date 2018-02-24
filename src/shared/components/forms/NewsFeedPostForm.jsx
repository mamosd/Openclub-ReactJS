import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Spin, Button, Dropdown, Menu, Icon, message } from 'antd'
import Form, { Item as FormItem } from 'antd/lib/form';
import Input, { Group as InputGroup } from 'antd/lib/input';
import { ContentPage } from 'components/layout';
import cx from 'classnames';
import './NewsFeedPostForm.scss';
import Card from 'antd/lib/card'
import PostAttachment from 'components/cards/PostAttachment'
import userImage from 'utils/user_photo'

const URLexpression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/

class NewsFeedPost extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    mutate: PropTypes.func,
    activeRequest: PropTypes.bool,
    inline: PropTypes.bool,
    hidePrivacy: PropTypes.bool,
    viewer: PropTypes.object,
    placeholder: PropTypes.string
  }
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      embed: {},
      height: 'auto',
      privacy: {
        title: 'Public',
        icon: 'global',
        key: 'public'
      },
      activeRequest: false
    }
    this.resetState = this.state;

    this.handleInput = this.handleInput.bind(this);
    this.submit = this.submit.bind(this);
    this.timeout = null;
  }
  async getEmbed(url) {
    if (this.state.activeRequest === true) return;
    this.setState({ activeRequest: true });
    const { mutate } = this.props;

    try {
      const data = await mutate({
        variables: { url }
      });
      this.setState({
        embed: data.data.embed,
        activeRequest: false
      });
    } catch (err) {
      this.setState({ activeRequest: false });
    }
  }
  submit(e) {
    e.preventDefault();
    let submission = {
      text: this.state.input
    };
    if (!this.props.hidePrivacy) {
      submission.privacy = this.state.privacy.key;
    }
    if (this.state.embed && this.state.embed.content) {
      submission.attachment = this.state.embed.content
    }
    if (!submission.attachment && submission.text.length === 0) {
      message.error('You must write or upload something to post.', 10);
      return;
    }
    this.setState({ embed: {}, text: '' });
    this.props.handleSubmit(submission);
  }
  handleInput(e) {
    if (e.keyCode === 13 && e.metaKey) {
      this.submit();
      return true;
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.state.input !== '' && this.state.input.match(URLexpression)) {
        this.getEmbed(this.state.input.match(URLexpression)[0]);
      }
    }, 1000); // Just ensuring that we don't run this on every click.
    this.setState({ input: e.target.value });
  }
  setPrivacy(privacy) {
    const { key, item } = privacy;
    const { title, icon } = item.props;
    this.setState({
      privacy: {
        title,
        icon,
        key
      }
    });
  }
  formatContent(content) {
    if (!content) return <div />;
    return <PostAttachment attachment={content} />
  }
  render() {
    const { hidePrivacy, inline, viewer, placeholder } = this.props;
    if (!viewer) return <div />;

    const { embed } = this.state;
    const content = embed ? embed.content : {};

    const privacyOptions = [
      {
        title: 'Public',
        icon: 'global',
        key: 'public'
      },
      {
        title: 'Members only',
        icon: 'contacts',
        key: 'private'
      },
    ]
    const privacyMenu = (
      <Menu onClick={this.setPrivacy.bind(this)}>
        {privacyOptions.map((value, key) => <Menu.Item {...value}><Icon type={value.icon} /> {value.title}</Menu.Item>)}
      </Menu>
    );
    const comp = (
      <div className="newsfeed-post">
        <div>
          {this.formatContent(content)}
        </div>
        <Form onSubmit={this.submit}>
          <InputGroup compact style={{ display: 'flex' }}>
            <div className="media">
              <div className="creator-image small">
                <img src={userImage(viewer.images, 'thumb')} alt={viewer.name} role="presentation" />
              </div>
            </div>
            <Input
              className={cx({ inline })}
              type="textarea"
              autosize={{ minRows: 1 }}
              onChange={this.handleInput}
              placeholder={placeholder || "Share something..."}
              style={{ flexGrow: 2 }}
              />
            {!hidePrivacy && <Dropdown overlay={privacyMenu}>
              <Button type="default"><Icon type={this.state.privacy.icon} /> {this.state.privacy.title} <Icon type="down" /></Button>
            </Dropdown>}
            <Button type="primary" onClick={this.submit} disabled={this.props.activeRequest} htmlType="submit">Post</Button>
          </InputGroup>
        </Form>
      </div>
    );
    if (this.props.activeRequest) {
      return (<Spin tip="Posting...">
        {comp}
      </Spin>)
    }
    return comp;
  }

}
const embedMutation = gql`
mutation embedMutation($url: String!) {
  embed(url: $url) {
    content
  }
}
`
const NewsFeedPostWithApollo = graphql(embedMutation)(NewsFeedPost)

export default connect(state => ({
  token: state.auth.token
}))(NewsFeedPostWithApollo)
