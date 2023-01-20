import gql from "graphql-tag";

const APP_UPDATE_ONE_MUTATION = gql`
  mutation($query: AppQueryInput, $set: AppUpdateInput!) {
    updateOneApp(query: $query, set: $set) {
      _id
    }
  }
`;

export { APP_UPDATE_ONE_MUTATION };
