import gql from 'graphql-tag';

export const members = gql`
  query members($clubId: MongoID!, $cursor: ID, $first: Int!) {
    members(clubId: $clubId) {
      members(cursor: $cursor, first: $first) {
        total_count
        page_info{
          has_next_page
          next_page_cursor
        }
        edges{
          _id
          user_id
          bio
          roles
          feed_permissions
          subscription{
            active
            start_date
            pending_approval
            membership_plan_id
            auto_renew
            expiry_date
          }
          profile{
            name
            images{
              thumb
              square
            }
            fbid
            email
            phone
            address{
              formatted_address
            }
          }
        }
      }
    }
  }
`

export default members;
