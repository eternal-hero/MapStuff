import gql from "graphql-tag";

const APP_QUERY = gql`
  query($input: AppQueryInput) {
    app(query: $input) {
      _id
      app_url
      map_api_key
    }
  }
`;

const APPS_QUERY = gql`
  query($input: AppQueryInput) {
    apps(query: $input) {
      _id
      app_url
    }
  }
`;

export { APP_QUERY, APPS_QUERY };
