import gql from 'graphql-tag';

export default gql`
  query user {
    user {
      _id
      email
      birthday
      name
      notification_token
      helpdesk_jwt
      fbid
      address {
        formatted_address
      }
      stripe_account {
        cards
        default_source
      }
      images {
        thumb
        square
      }
      invitations{
        _id
        owner_entity{
          type
          owner_id
          meta
        }
        creator{
          name
          images{
            square
          }
          email
        }
        subscription{
          expiry_date
        }
        invitation_url
        membership_plan{
          _id
          name
          description
        }
        roles
      }
      memberships {
        _id
        club_id
        feed_permissions
        roles
        club{
          _id
          name
          images{
            square
            thumb
            background
          }
          slug
        }
        following
        notifications
        directory_visible
        display_email
        display_phone
        display_messenger
        bio
        subscription{
          active
          start_date
          expiry_date
          pending_approval
          auto_renew
          membership_plan{
            _id
            name
            prices{
              price{
                amount_float
              }
              setup_price{
                amount_float
              }
            }
          }
        }
      }
    }
  }
`
