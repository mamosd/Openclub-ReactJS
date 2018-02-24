// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import m from 'moment';
import n from 'numeral';

// Components
import { ContentPage, PageHeader } from 'components/layout'

// Styles
import 'react-super-responsive-table/src/SuperResponsiveTableStyle.css'

class Transactions extends Component {
  static propTypes = {
    transactions: PropTypes.array,
    clubId: PropTypes.string
  }
  constructor(props) {
    super(props);

    this.types = {
      clubs: 'Club',
      events: 'Event',
      members: 'Membership',
      users: 'Member',
      attendees: 'Attendee'
    }

    this.formatCurrency = num => n(num).format('$0,0.00');
    this.getType = (type, meta) => type in this.types ? this.types[type] : (typeof meta === 'object' && meta.title) || type;
    this.negativePosition = (amount, f) => f.owner_id === this.props.clubId ? this.formatCurrency(0 - amount) : this.formatCurrency(amount);
  }
  render() {
    const { data } = this.props;
    if (data.loading) return <div>Loading...</div>;

    const { transactions = [] } = data;
    return (
      <ContentPage>
        <PageHeader title="Transactions" />
        <p>This table will include all transactions processed by this club.</p>
        <hr className="bottom-gap-large" />
        <Table className="table">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Customer</Th>
              <Th>Description</Th>
              <Th>Transaction Fee</Th>
              <Th>Total Deposit</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.length === 0 && <Tr><Td colSpan={6} className="text-center">No transactions logged.</Td></Tr>}
            {transactions.map(t => (
              <Tr>
                <Td>{m(t.datestamp).format('DD/MM/YYYY')}</Td>
                <Td>{t.amount ? this.negativePositive(t.amount.amount, t.from) : '-'}</Td>
                <Td>{this.getType(t.from.type, t.from.meta)}</Td>
                <Td>{this.getType(t.for.type, t.for.meta)}</Td>
                <Td>{t.fee ? this.formatCurrency(0 - t.fee.amount) : '-'}</Td>
                <Td>{t.deposit_amount ? this.formatCurrency(t.deposit_amount.amount) : '-'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </ContentPage>
    )
  }
}

const TransactionsQuery = gql`
  query clubTransactions($clubId: MongoID!, $first: Int!, $cursor: ID) {
    clubTransactions(clubId: $clubId) {
      _id
      transactions(first: $first, cursor: $cursor){
        edges{
          transaction{
            _id
            status
            datestamp
            amount{
              amount
            }
            fee_amount{
              amount
            }
            deposit_amount{
              amount
            }
            for{
              owner_id
              type
              meta
            }
            from{
              owner_id
              type
              meta
            }
          }
        }
      }
    }
  }
`
const TransactionsApollo = graphql(TransactionsQuery, {
  options: props => ({
    variables: {
      clubId: props.clubId,
      first: 50
    }
  })
})(Transactions);

export default TransactionsApollo;
