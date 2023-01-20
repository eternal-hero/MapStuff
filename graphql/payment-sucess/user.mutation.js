import gql from "graphql-tag";

const USER_UPDATE_ONE_MUTATION = gql`
  mutation($query: UserQueryInput, $set: UserUpdateInput!) {
    updateOneUser(query: $query, set: $set) {
      _id
      auth_id
    }
  }
`;

export { USER_UPDATE_ONE_MUTATION };
