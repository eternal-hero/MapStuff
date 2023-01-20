import gql from "graphql-tag";

const APPS_COUNT_QUERY = gql`
  query($input: AppQueryInput) {
    apps(query: $input) {
      _id
      app_url
    }
  }
`;

export { APPS_COUNT_QUERY };
