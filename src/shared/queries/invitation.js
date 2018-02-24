import gql from 'graphql-tag';

export const types = `
    _id
    owner_entity{
      owner_id
      type
      meta
    }
    creator{
      name
      images{
        square
      }
    }
    roles
    membership_plan{
      _id
      name
      description
      prices{
        _id
        duration
        price{
          amount
          amount_float
        },
        setup_price{
          amount
          amount_float
        }
      }
    }
    subscription{
      start_date
      membership_plan{
        _id
        name
        description
        prices{
          _id
          duration
          price{
            amount
            amount_float
          },
          setup_price{
            amount
            amount_float
          }
        }
      }
      expiry_date
      join_date
    }
    created_date
`

export default gql`
query invitation($invitationUrl: String!) {
  invitation(invitationUrl: $invitationUrl) {
    ${types}
  }
}
`
