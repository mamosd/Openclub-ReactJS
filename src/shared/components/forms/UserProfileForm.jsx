import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { required, maxLength, email } from 'utils/form_validation/errors'
import {
  Form,
  FieldContainer,
  Input,
  Address,
  Button,
  ImageUploader,
  DatePicker
} from 'components/form_controls'

class UserProfileForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    token: PropTypes.string,
    customButtonRender: PropTypes.func,
    customSubmitCallback: PropTypes.func
  }
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
  }
  submit(...args) {
    const { customSubmitCallback, handleSubmit } = this.props;
    handleSubmit(...args)
    if (customSubmitCallback) customSubmitCallback(...args);
  }
  render() {
    const { token, handleSubmit, customButtonRender, submitting } = this.props;

    return (
      <div className="max-form">
        <FieldContainer required title="Full Name">
          <Field
            name="name"
            type="text"
            help="Full Name"
            validate={[required, maxLength(64)]}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer title="Profile Picture">
          <Field
            name="images.square"
            component={ImageUploader}
            token={token}
            postname="square"
            action={`${process.env.ICEPICK_URL}/upload/image/square`}
          />
        </FieldContainer>
        <FieldContainer title="Billing Address">
          <Field
            name="address"
            help="Enter your address"
            component={Address}
          />
        </FieldContainer>
        <FieldContainer required title="Date of Birth">
          <Field
            name="birthday"
            help="Date of birth"
            component={DatePicker}
            />
        </FieldContainer>
        <FieldContainer required title="Email Address">
          <Field
            name="email"
            type="text"
            help="Email address"
            validate={[required, email]}
            component={Input}
          />
        </FieldContainer>
        {customButtonRender ? customButtonRender(this.submit, submitting) : <Button loading={submitting} type="primary" htmlType="submit" onClick={this.submit}>Save Profile</Button>}
      </div>
    );
  }
}
const ProfileReduxForm = reduxForm({
  form: 'userProfile',
  enableReinitialize: true
})(UserProfileForm)

export default connect(state => ({
  token: state.auth.token
}))(ProfileReduxForm)
