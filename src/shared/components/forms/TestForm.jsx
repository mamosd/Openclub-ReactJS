import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { required, maxLength, slug } from 'utils/form_validation/errors'
import {
  Form,
  FieldSet,
  FieldContainer,
  Input,
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  RangePicker,
  Switch,
  Select,
  RadioGroup,
  TimePicker,
  ImageUploader,
  FileUploader
} from 'components/form_controls'

const TestForm = ({ handleSubmit, createForm, show }) => (
  <Form onSubmit={handleSubmit}>
    <FieldContainer required={true} title="Input">
      <Field
        name="somename"
        type="text"
        help="What is your name?"
        validate={[required, maxLength(32)]}
        component={Input}
      />
    </FieldContainer>
    <FieldContainer required={true} title="Input Two">
      <Field
        name="linko"
        type="text"
        help={`Enter a unique link.`}
        validate={[required, slug]}
        component={Input}
      />
    </FieldContainer>
    <FieldContainer title="Checkbox">
      <Field
        name="checker"
        label="Check this box darnit"
        component={Checkbox}
      />
    </FieldContainer>
    <FieldContainer title="Checkbox Group">
      <Field
        name="checkergroup"
        options={[
          { label: 'Option One', value: 'option_one' },
          { label: 'Option Two', value: 'option_two' }
        ]}
        component={CheckboxGroup}
      />
    </FieldContainer>
    <FieldContainer title="Date Selector">
      <Field
        name="singledate"
        component={DatePicker}
        size="large"
      />
    </FieldContainer>
    <FieldContainer title="Multi Date Selector">
      <Field
        name="rangedate"
        size="large"
        component={RangePicker}
      />
    </FieldContainer>
    <FieldContainer title="Time Picker">
      <Field
        name="thetime"
        component={TimePicker}
      />
    </FieldContainer>
    <FieldContainer title="Switch">
      <Field
        name="switchy"
        component={Switch}
      />
    </FieldContainer>
    <FieldContainer title="Radio Button">
      <Field
        name="radiogo"
        component={RadioGroup}
        options={[
          { label: 'First Radio', value: 3 },
          { label: 'Second Radio', value: 'yes' }
        ]}
      />
    </FieldContainer>
    <FieldContainer title="Image Uploader">
      <Field
        name="profiletest"
        action="test.com/tester"
        component={ImageUploader}
      />
    </FieldContainer>
    <FieldContainer title="File Uploader">
      <Field
        name="regfiles"
        component={FileUploader}
      />
    </FieldContainer>
    <FieldContainer title="Select">
      <Field
        name="someselect"
        component={Select}
        options={[
          { key: 'shiftyfive', value: 'Select Option One' },
          { key: 'wotwot', value: 'Another option' }
        ]}
      />
    </FieldContainer>
    <FieldContainer title="Multi Select">
      <Field
        name="multime"
        component={Select}
        multiple
        options={[
          { key: 'mary', value: 'Mary' },
          { key: 'john', value: 'John' }
        ]}
      />
    </FieldContainer>
    <Button type="primary" htmlType="submit">Submit</Button>
  </Form>
)

const TestReduxForm = reduxForm({
  form: 'test_form'
})(TestForm)

// connect the current form data so we can use it to display the slug name
export default connect(state => ({
  initialValues: {
    checker: false,
    checkergroup: {
      option_one: true
    }
  }
}))(TestReduxForm)
