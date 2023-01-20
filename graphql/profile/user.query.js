import gql from "graphql-tag";

const USER_QUERY = gql`
  query($query: UserQueryInput) {
    user(query: $query) {
      email
      username
    }
  }
`;

export { USER_QUERY };
