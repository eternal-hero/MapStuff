import gql from "graphql-tag";

const APPS_QUERY = gql`
  query($input: AppQueryInput) {
    apps(query: $input) {
      _id
      app_url
      map_api_key
      filters {
        tags
        title
      }
    }
  }
`;

export { APPS_QUERY };
