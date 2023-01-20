import gql from "graphql-tag";

const USER_QUERY = gql`
  query($query: UserQueryInput) {
    user(query: $query) {
      stripe_customer_id
    }
  }
`;

export { USER_QUERY };
