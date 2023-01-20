import gql from "graphql-tag";

const USER_QUERY = gql`
  query($query: UserQueryInput) {
    user(query: $query) {
      stripe_customer_id
    }
  }
`;

const USER_ID_QUERY = gql`
  query($query: UserQueryInput) {
    user(query: $query) {
      _id
    }
  }
`;

export { USER_QUERY, USER_ID_QUERY };
