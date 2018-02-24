import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import _ from 'lodash';
import { required, maxLength, slug, reservedSlugs } from 'utils/form_validation/errors'
import {
  Form,
  FieldSet,
  FieldContainer,
  Input,
  Button,
  ImageUploader,
  FileUploader
} from 'components/form_controls'

class CreateClubForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    createForm: PropTypes.object,
    token: PropTypes.string
  }
  render() {
    const { handleSubmit, createForm, token } = this.props;

    const slugString = (createForm && createForm.values && createForm.values.slug) ?
      createForm.values.slug : '<your id here>'

    return (
      <Form onSubmit={handleSubmit} className="m-sm">
        <FieldContainer required title="Community Name">
          <Field
            name="club.name"
            type="text"
            help="Pick a name for your community page."
            validate={[required, maxLength(64)]}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer required title="Handle">
          <Field
            name="slug"
            type="text"
            addonBefore={location ? `${location.origin}/` : 'http://www.openclub.co/'}
            help={<span>Pick a unique handle — you can't change this later.<br />{(location ? location.origin : 'http://www.openclub.co') + '/' + slugString}</span>}
            validate={[required, slug, maxLength(64), reservedSlugs]}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer title="Community Profile Photo">
          <p>Pick a profile photo that your members can use to identify you on OpenClub.</p>
          <Field
            name="club.images.square"
            component={ImageUploader}
            token={token}
            postname="square"
            action={`${process.env.ICEPICK_URL}/upload/image/square`}
          />
        </FieldContainer>
        <FieldContainer title="Community Cover Photo">
          <p>Spruce up the profile with a cover photo. You don't have to do this now, you can pick one later.</p>
          <Field
            name="images.background"
            token={token}
            postname="background"
            action={`${process.env.ICEPICK_URL}/upload/image/background`}
            aspect={100 / 37}
            component={ImageUploader}
          />
        </FieldContainer>
        <div className="text-center">
          <Button type="primary" htmlType="submit" loading={this.props.submitting} size="large">
            <i className="fa fa-fw fa-check" /> Get Started
          </Button>
        </div>
      </Form>
    )
  }
}

const CreateClubReduxForm = reduxForm({
  form: 'create_club'
})(CreateClubForm)

// connect the current form data so we can use it to display the slug name
export default connect(state => ({
  token: state.auth.token,
  createForm: state.form.create_club,
  initialValues: {
    checker: false,
    checkergroup: {
      option_one: true
    }
  }
}))(CreateClubReduxForm)
