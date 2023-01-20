import gql from "graphql-tag";

const APPS_QUERY = gql`
  query($input: AppQueryInput) {
    apps(query: $input) {
      _id
      app_url
      filters {
        tags
        title
      }
    }
  }
`;
const UPDATE_ONE_APP = gql`
  mutation($set: AppUpdateInput!, $query: AppQueryInput) {
    updateOneApp(query: $query, set: $set) {
      _id
      filters {
        tags
        title
      }
    }
  }
`;

export { APPS_QUERY, UPDATE_ONE_APP };
