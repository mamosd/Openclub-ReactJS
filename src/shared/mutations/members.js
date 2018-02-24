import gql from 'graphql-tag';

export const approveMemberGQL = gql`
  mutation approveMember($clubId: MongoID!, $memberId: MongoID!) {
    approveMember(clubId: $clubId, memberId: $memberId) {
      _id
      subscription{
        pending_approval
        start_date
        expiry_date
      }
    }
  }
`;

export const deleteMemberGQL = gql`
  mutation deleteMember($clubId: MongoID!, $memberId: MongoID!) {
    deleteMember(clubId: $clubId, memberId: $memberId) {
      _id
    }
  }
`;

export const changeMemberGQL = gql`
  mutation changeMember($clubId: MongoID!, $memberId: MongoID!, $subscription: subscriptionInput!) {
    changeMember(clubId: $clubId, memberId: $memberId, subscription: $subscription) {
      _id
      subscription{
        active
        pending_approval
        start_date
        expiry_date
        auto_renew
        membership_plan_id
        membership_plan_price_id
      }
    }
  }
`;
