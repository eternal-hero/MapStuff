import gql from "graphql-tag";

const APP_UPDATE_ONE_MUTATION = gql`
  mutation(
    $query: AppQueryInput
    $set: AppUpdateInput!
    $locationQuery: LocationQueryInput
    $locationSet: LocationUpdateInput!
  ) {
    updateOneApp(query: $query, set: $set) {
      _id
      app_url
      map_api_key
    }
    updateManyLocations(query: $locationQuery, set: $locationSet) {
      modifiedCount
    }
  }
`;

const APP_INSERT_ONE_MUTATION = gql`
  mutation($input: AppInsertInput!) {
    insertOneApp(data: $input) {
      app_url
    }
  }
`;

export { APP_UPDATE_ONE_MUTATION, APP_INSERT_ONE_MUTATION };
