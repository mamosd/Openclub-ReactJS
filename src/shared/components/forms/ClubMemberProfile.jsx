import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Form, FieldContainer, Input, Button, Checkbox } from 'components/form_controls';

class ClubMemberProfile extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    formValues: PropTypes.object
  }
  constructor(props) {
    super(props);
  }
  render() {
    const { handleSubmit, formValues } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <FieldContainer title="Feed">
          <Field
            name="following"
            component={Checkbox}
            label="Follow the club feed"
            onChange={() => setTimeout(() => handleSubmit(), 1)}
            isSwitch
          />
          <br />
          <Field
            name="notifications"
            component={Checkbox}
            label="Notify me of new posts"
            onChange={() => setTimeout(() => handleSubmit(), 1)}
            isSwitch
          />
        </FieldContainer>
        <FieldContainer title="Member Directory">
          <Field
            name="directory_visible"
            component={Checkbox}
            label="Display my profile in the club directory"
            onChange={() => setTimeout(() => handleSubmit(), 1)}
            isSwitch
          />
        {formValues.directory_visible && (
          <div>
            <hr />
            <FieldContainer title="Profile">
              <Field
                name="bio"
                type="textarea"
                rows={3}
                component={Input}
                maxLength={180}
                help={`A message about you that will appear in the club directory. This is completely optional. (${formValues.bio ? formValues.bio.length : 0}/180)`}
              />
            <Button htmlType="submit">Save Profile</Button>
            </FieldContainer>
            <hr />
            <FieldContainer title="Privacy Settings">
              <Field
                name="display_email"
                component={Checkbox}
                label="Show my email in the club directory"
                onChange={() => setTimeout(() => handleSubmit(), 1)}
                isSwitch
              />
              <br />
              <Field
                name="display_phone"
                component={Checkbox}
                label="Show my phone number in the club directory"
                onChange={() => setTimeout(() => handleSubmit(), 1)}
                isSwitch
              />
              <br />
              <Field
                name="display_messenger"
                component={Checkbox}
                label="Let other members contact me via Facebook Messenger"
                onChange={() => setTimeout(() => handleSubmit(), 1)}
                isSwitch
              />
            </FieldContainer>
          </div>
        )}
        </FieldContainer>
      </Form>
    )
  }
}
const ClubMemberProfileForm = reduxForm({
  form: 'club_member',
  enableReinitialize: true
})(ClubMemberProfile);

export default connect(state => ({
  formValues: _.get(state, 'form.club_member.values', {})
}))(ClubMemberProfileForm);
