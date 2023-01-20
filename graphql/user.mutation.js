import gql from "graphql-tag";

const USER_UPDATE_ONE_MUTATION = gql`
mutation($query: UserQueryInput, $set: UserUpdateInput!) {
    updateOneUser(query: $query, set: $set) {
      realm_api_key
      _id
    }
  }
`;

export { USER_UPDATE_ONE_MUTATION };