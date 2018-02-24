import gql from 'graphql-tag';

export default gql`
  mutation signin($accessToken: ID!) {
    signin(access_token: $accessToken) {
      token
    }
  }
`
