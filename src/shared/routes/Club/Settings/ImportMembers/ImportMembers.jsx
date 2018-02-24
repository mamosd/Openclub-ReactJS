import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import Select, { Option } from 'antd/lib/select';
import Form, { Item as FormItem } from 'antd/lib/form';
import Steps, { Step } from 'antd/lib/steps';
import Progress from 'antd/lib/progress';
import Modal from 'antd/lib/modal';
import Alert from 'antd/lib/alert';
import csvjson from 'csvjson';
import _ from 'lodash';
import m from 'moment';
import { spawn } from 'threads';
import { email } from 'utils/form_validation/errors';

import './ImportMembers.scss';

class ImportMembers extends Component {
  static propTypes = {
    createMutation: PropTypes.func,
    updateMutation: PropTypes.func,
    club: PropTypes.object,
    submitting: PropTypes.bool,
    invite: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      rawData: [],
      progress: 0,
      colConfig: [],
      validData: [],
      invalidData: [],
      importStatus: []
    }

    this.input = null;
    this.fileUploader = this.fileUploader.bind(this);
    this.getImportStatus = () => this.state.importStatus;
  }
  async fileUploader(ev) {
    try {
      const file = ev.target.files[0];
      if (!file) return;

      let upload = new FileReader();
      this.setState({ fileProgress: 0 })
      const rawData = await new Promise(resolve => {
        upload.onload = (e) => {
          const dataArray = csvjson.toArray(e.target.result);
          resolve(dataArray);
        }
        upload.readAsText(file);
      });
      if (rawData instanceof Array === false || rawData.length <= 0) throw new Error('The file uploaded could not be processed.');

      let lastVal;
      rawData.forEach((val, key) => {
        this.setState({ progress: Math.ceil((100 / rawData.length) * key) })
        lastVal = val.length;
        if (val.length !== lastVal) throw new Error('The CSV has invalid row lengths. Please check the file and try again.')
      })

      this.setState({ rawData, step: 1, progress: 0, colConfig: rawData[0].map(() => false) });
      return true;
    } catch (err) {
      console.trace(err)
      Modal.error({
        title: 'Import Error',
        content: err.message
      });
    }
  }
  async validateFields() {
    const { club } = this.props;
    let membershipPlans = _.get(club, 'membership_plans', []);
    console.log(membershipPlans);
    try {
      this.state.colConfig.forEach((val) => {
        if (!val) throw new Error('Please select a value for each of the column headers before you continue.');
      });
      this.setState({ step: 2 });
      let validData = [];
      let invalidData = [];
      const { colConfig, rawData } = this.state;

      const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      const dateRegex = /^[\d]{4}-[\d]{2}-[\d]{2}$/;

      rawData.forEach((row, rowKey) => {
        let errors = [];
        let rowRecord = {};
        let newRow = row.map((col, colKey) => {
          const config = colConfig[colKey];
          if (config === 'email') {
            if (emailRegex.test(col) === false) {
              errors.push(config);
              return col;
            }
            rowRecord.email = col.match(emailRegex)[0];
            return rowRecord.email;
          }
          if (config === 'expiry_date' || config === 'last_renewal_date' || config === 'join_date') {
            if (dateRegex.test(col) === false) errors.push(config)
            rowRecord[config] = col;
            return col;
          }
          if (config === 'billing_period') {
            if (['YEARLY', 'BIYEARLY', 'MONTHLY', 'WEEKLY', 'FREE'].indexOf(col.toUpperCase()) === -1) errors.push(config)
            rowRecord[config] = col;
            return col;
          }
          if (config === 'membership_plan') {
            if (_.findIndex(membershipPlans, p => p.name === col) < 0) errors.push(config);
            rowRecord[config] = col;
            return col;
          }
          rowRecord[config] = col;
          return col;
        });

        if (errors.length > 0) {
          invalidData.push({ data: newRow, errors });
          this.setState({ invalidData, progress: Math.ceil((100 / rawData.length) * rowKey) })
          return;
        }

        let membershipPlan = _.find(membershipPlans, plan => plan.name === rowRecord.membership_plan);
        if (!membershipPlan) throw new Error(`The plan name ${rowRecord.membership_plan} could not be processed.`);
        let potentialPlanPrice = _.find(membershipPlan.prices, price => price.duration === rowRecord.billing_period);
        let membershipPrice;

        if (rowRecord.billing_period === 'FREE' && _.get(membershipPlan, 'prices', []).length === 0) membershipPrice = 0;
        else if (potentialPlanPrice) membershipPrice = _.get(potentialPlanPrice, '_id', 0);
        else errors.push('billing_period');

        let yearAddition;
        switch (rowRecord.billing_period) {
          case 'YEARLY': yearAddition = [1, 'years']; break;
          case 'BIYEARLY': yearAddition = [6, 'months']; break;
          case 'MONTHLY': yearAddition = [1, 'months']; break;
          case 'FORTNIGHTLY': yearAddition = [2, 'weeks']; break;
          case 'WEEKLY': yearAddition = [1, 'weeks']; break;
          case 'LIFETIME': yearAddition = null; break;
          default: errors.push('billing_period'); break;
        }

        let expiryDate = null;
        if (rowRecord.billing_period) {
          expiryDate = rowRecord.expiry_date ? new Date(rowRecord.expiry_date) : m(rowRecord.last_renewal_date).add(...yearAddition).toDate();
        }

        let subscription = {
          membership_plan_id: membershipPlan._id,
          membership_plan_price_id: membershipPrice,
          expiry_date: expiryDate,
        };

        if (rowRecord.join_date) subscription.join_date = new Date(rowRecord.join_date);

        else {
          validData.push({
            recipient: rowRecord.email,
            subscription
          });
        }
        this.setState({ validData, invalidData, progress: Math.ceil((100 / rawData.length) * rowKey) });
      })
      this.setState({ progress: 0 });
    } catch (err) {
      this.setState({ step: 1 });
      console.trace(err);
      Modal.error({
        title: 'Validation Error',
        content: err.message
      });
    }
  }
  processImport() {
    const { validData } = this.state;
    let chunks = _.chunk(validData, 10);
    this.setState({ import: true, chunks, importStatus: [], progress: 1 });

    window.setTimeout(() => {
      Promise.all(chunks.map((chunk, chunkIndex) => this.importChunk(chunkIndex))).then(() => { this.setState({ step: 3, progress: 100 }) });
    }, 500);
  }
  async importChunk(chunkIndex) {
    const { chunks } = this.state;
    const chunk = chunks[chunkIndex];

    const { invite, club } = this.props;
    let res = null;
    try {
      res = await invite({
        variables: {
          clubId: club._id,
          invitations: chunk
        }
      });
      res = res.data.clubInvite
    } catch (err) {
      res = err;
    }
    let importStatus = [...this.getImportStatus(), res];
    this.setState({ importStatus, progress: Math.ceil((100 / chunks.length) * chunkIndex) });
  }
  render() {
    const { club } = this.props;
    const { rawData } = this.state;
    const steps = [{
      title: 'Upload CSV',
      content: 'Upload your member CSV',
    }, {
      title: 'Verify Data',
      content: 'Verify the data in the CSV',
    }, {
      title: 'Import',
      content: 'Import and invite your members',
    }, {
      title: 'Done',
      content: 'Complete'
    }];

    let step = 0;

    const updateCol = (col, val) => {
      const colConfig = this.state.colConfig;
      colConfig[col] = val;
      this.setState({ colConfig });
    }

    const isDisabled = (col, field) => {
      if (_.get(this.state.colConfig, `[${col}]`) === field) return false;
      if (this.state.colConfig.indexOf(field) > -1) return true;
    }

    const fieldType = col => (
      <Select value={this.state.colConfig[col] || undefined} onChange={updateCol.bind(this, col)} placeholder="Pick Field Type">
        <Option value="full_name" disabled={isDisabled(col, 'full_name')}>Full Name</Option>
        <Option value="email" disabled={isDisabled(col, 'email')}>Email</Option>
        <Option value="expiry_date" disabled={isDisabled(col, 'expiry_date') || isDisabled(col, 'last_renewal_date')}>Expiry Date</Option>
        <Option value="join_date" disabled={isDisabled(col, 'join_date')}>Join Date</Option>
        <Option value="last_renewal_date" disabled={isDisabled(col, 'last_renewal_date') || isDisabled(col, 'expiry_date')}>Renewal Date</Option>
        <Option value="membership_plan" disabled={isDisabled(col, 'membership_plan')}>Membership Plan</Option>
        <Option value="billing_period" disabled={isDisabled(col, 'billing_period')}>Billing Period</Option>
        <Option value="ignore">Ignore</Option>
      </Select>
    )

    let progressStatus;
    if (this.state.import) progressStatus = 'active';
    if (this.state.progress === 100) progressStatus = undefined;
    this.state.importStatus.forEach(i => {
      if (i instanceof Error) progressStatus = 'exception';
    });

    return (
      <Form>
        <h4 className="bottom-gap">Import Members</h4>
        <hr className="bottom-gap-large" />
        <Steps current={step} className="bottom-gap-large">
          {steps.map(s => <Step key={s.title} title={s.title} />)}
        </Steps>
        <div className="step-content">
          {!club.membership_plans && (
            <p>You must add membership plans before you can import members.</p>
          )}
          {club.membership_plans && this.state.step === 0 && (
            <div className="bottom-gap">
              <p className="bottom-gap">
                You can import your member database into OpenClub via CSV. We support the following fields:<br />
                Email, Plan Name, Billing Period, Join Date and an Expiry Date or Last Renewal Date.<br /><br />
                Any unrecognised fields will still be stored under the member's account as Meta Data that can be accessed later as custom fields.<br /><br />
                <strong>Upload Requirements:</strong>
              </p>
              <ul>
                <li>- Date Format must be YYYY-MM-DD format (ie. {m().format('YYYY-MM-DD')})</li>
                <li>- Billing Period must be one of the period available on the Plan (either: YEARLY, BIYEARLY, MONTHLY, WEEKLY or FREE)</li>
                <li>- You can only use Last Renewal Date or Expiry Date, not both.</li>
                <li>- Email addresses must be valid</li>
                <li>- Plan titles must match your club plans (ie. {club.membership_plans.map(p => p.title)})</li>
                <li>- The Billing Period must match a period available within the specified plan</li>
              </ul>
              <Button disabled={this.state.progress !== 0} type="primary" onClick={() => { this.input.click() }}><i className="fa fa-fw fa-upload" /> Import CSV</Button>
              <input ref={input => this.input = input} accept=".csv" type="file" style={{ display: 'none' }} onChange={this.fileUploader.bind(this)} />
            </div>
          )}
          {this.state.progress !== 0 && (
            <div className="bottom-gap">
              {this.state.import && <strong>Do not close your browser during this process</strong>}
              <strong>Processing entries...</strong>
              <Progress percent={this.state.progress} status={progressStatus} />
            </div>
          )}
          {this.state.step === 1 && (
            <div className="bottom-gap">
              <input ref={input => this.input = input} accept=".csv" type="file" style={{ display: 'none' }} onChange={this.fileUploader.bind(this)} />
              <div className="bottom-gap">
                <Button disabled={this.state.progress !== 0} type="primary" onClick={() => { this.input.click() }}><i className="fa fa-fw fa-upload" /> Upload Different CSV</Button>
                <Button type="primary" onClick={() => { this.validateFields() }} className="pull-right">Continue</Button>
              </div>
              <p className="bottom-gap">
                {"Please select the column headers and ensure that the data you have uploaded looks correct."}
              </p>
              <div style={{ overflowX: 'scroll' }}>
                <table className="table bottom-gap">
                  <tbody>
                    <tr style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                      {this.state.colConfig.map((row, key) => <td key={'head' + key}>{fieldType(key)}</td>)}
                    </tr>
                    {
                      rawData.map((row, rowKey) => <tr key={rowKey}>{row.map((cell, cellKey) => <td key={`rd${rowKey}-${cellKey}`}>{cell}</td>)}</tr>)
                    }
                  </tbody>
                </table>
              </div>
              {this.state.someExclusions && <Alert type="info" message="Rows Removed" description="Some rows have been removed because they were invalid." showIcon />}
              <hr className="bottom-gap top-gap" />
              <Button disabled={this.state.progress !== 0} type="primary" onClick={() => { this.input.click() }}><i className="fa fa-fw fa-upload" /> Upload Different CSV</Button>
              <Button type="primary" onClick={() => { this.validateFields() }} className="pull-right">Continue</Button>
            </div>
          )}
          {this.state.step === 2 && (
            <div className="bottom-gap">
              <p className="bottom-gap">Once the data is processed, you can begin importing.</p>
                {this.state.invalidData.length > 0 && (
                  <div className="bottom-gap">
                    <p className="bottom-gap">
                      <strong>Ready for Import</strong><br />
                      {this.state.validData.length} rows are ready for import<br />
                      <strong>Excluded Rows</strong><br />
                      The following rows will be excluded as they contain errors.
                    </p>
                    <table className="table bottom-gap">
                      <tbody>
                        {
                          this.state.invalidData.map((row, rowKey) => {
                            let { errors } = row;
                            errors = errors.map(e => this.state.colConfig.indexOf(e));
                            return <tr key={rowKey}>{row.data.map((cell, cellKey) => <td style={{ backgroundColor: errors.indexOf(cellKey) > -1 ? '#f39086' : 'white' }} key={`${rowKey}-${cellKey}`}>{cell}</td>)}</tr>;
                          })
                        }
                      </tbody>
                    </table>
                    <Button onClick={() => { this.setState({ step: 1 }) }}>Previous Step</Button>
                    <Button type="primary" disabled={this.state.progress !== 0} onClick={() => { Modal.confirm({ title: 'Begin Import', content: 'Are you sure you want to begin the import? This will produce an email invitation for each of these members to join your club.', onOk: () => { this.processImport() } }) }}>Import and Invite</Button>
                  </div>
                )}
            </div>
          )}
          {this.state.step === 3 && (
            <div className="bottom-gap">
              <p className="bottom-gap">
                The import is complete. The results are below.
              </p>
              <ul>
                {_.flattenDeep(this.state.importStatus).map((chunk, chunkkey) => {
                  if (chunk instanceof Error) return <li key={`err-${chunkkey}`} style={{ color: 'darkred' }}>— {chunk.message}</li>;
                  return <li key={chunk._id || `err-${chunkkey}`} style={{ color: 'darkgreen' }}>— {chunk.external_recipient || _.get(chunk, 'system_recipient.meta.email', 'Private User')} sent OK</li>
                })}
              </ul>
            </div>
          )}
        </div>
      </Form>
    )
  }
}

const inviteMutation = gql`
  mutation clubInvite($clubId: MongoID!, $invitations: [invitationInput]!){
    clubInvite(clubId: $clubId, invitations: $invitations) {
      _id
      external_recipient
      system_recipient{
        meta
      }
    }
  }
`
const ImportApollo = graphql(inviteMutation, {
  name: 'invite'
})(ImportMembers)

export default Form.create({})(ImportApollo);
