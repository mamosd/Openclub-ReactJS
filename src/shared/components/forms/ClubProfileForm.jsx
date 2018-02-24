import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { required, maxLength, slug, email, url, phone } from 'utils/form_validation/errors'
import {
  Form,
  FieldContainer,
  MonthPicker,
  Input,
  Select,
  Address,
  Button,
  ImageUploader,
  FileUploader
} from 'components/form_controls'

class ClubProfileForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    token: PropTypes.string
  }
  render() {
    const { handleSubmit, token, submitting } = this.props;

    const minimumAgeOptions = [
      { value: '0', title: 'All ages allowed' },
      { value: '13', title: '13 and older' },
      { value: '17', title: '17 and older' },
      { value: '18', title: '18 and older' },
      { value: '21', title: '21 and older' },
      { value: '23', title: '23 and older' },
      { value: '25', title: '25 and older' },
      { value: '30', title: '30 and older' },
      { value: '40', title: '40 and older' },
      { value: '50', title: '50 and older' },
      { value: '60', title: '60 and older' }
    ]

    return (
      <Form onSubmit={handleSubmit}>
        <FieldContainer required title="Name">
          <Field
            name="name"
            type="text"
            help="What is the name of your club?"
            validate={[required, maxLength(64)]}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer title="Profile Image">
          <Field
            name="images.square"
            component={ImageUploader}
            token={token}
            postname="square"
            aspect={1}
            action={`${process.env.ICEPICK_URL}/upload/image/square`}
          />
        </FieldContainer>
        <FieldContainer title="Background Image">
          <Field
            name="images.background"
            token={token}
            postname="background"
            action={`${process.env.ICEPICK_URL}/upload/image/background`}
            aspect={100 / 37}
            component={ImageUploader}
          />
        </FieldContainer>
        <FieldContainer title="Club Location">
          <Field
            name="details.location"
            help="What city or suburb is the club located in?"
            validate={[maxLength(64)]}
            component={Address}
            types={['(regions)']}
          />
        </FieldContainer>
        <FieldContainer title="About">
          <Field
            name="details.about"
            type="textarea"
            rows={6}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer title="Year Founded">
          <Field
            name="details.founded"
            component={MonthPicker}
          />
        </FieldContainer>
        <FieldContainer required title="Minimum Age of Members">
          <Field
            name="details.minimum_age"
            component={Select}
            help="Please select the minimum age members must be to join the club."
            options={minimumAgeOptions}
          />
        </FieldContainer>
        <FieldContainer title="Contact Email">
          <Field
            name="details.email"
            type="text"
            help="What is the best club contact email?"
            validate={[email]}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer title="Contact Phone Number">
          <Field
            name="details.phone"
            type="number"
            help="What is the best club contact phone number?"
            validate={[phone]}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer title="Club Website">
          <Field
            name="details.website"
            type="text"
            help="What is the url of your club website?"
            validate={[url]}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer title="Facebook">
          <Field
            addonBefore="facebook.com/"
            name="details.facebook"
            type="text"
            help="What is the url of your clubs facebook page?"
            validate={[slug, maxLength(128)]}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer title="Instagram">
          <Field
            addonBefore="@"
            name="details.instagram"
            type="text"
            help="What is the user id of your clubs instagram account?"
            validate={[maxLength(64)]}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer title="LinkedIn">
          <Field
            addonBefore="linkedin.com/company/"
            name="details.linkedin"
            type="text"
            help="What is the url of your clubs linkedin page?"
            validate={[slug, maxLength(128)]}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer title="Twitter">
          <Field
            addonBefore="@"
            name="details.twitter"
            type="text"
            help="What is the id of your clubs twitter user account?"
            validate={[maxLength(32)]}
            component={Input}
          />
        </FieldContainer>
        <Button type="primary" htmlType="submit" loading={submitting}>Save Profile</Button>
      </Form>
    )
  }
}

const ClubProfileReduxForm = reduxForm({
  form: 'create_club'
})(ClubProfileForm)

export default connect(state => ({
  token: state.auth.token
}))(ClubProfileReduxForm)
