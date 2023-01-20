import gql from "graphql-tag";

const APP_INSERT_ONE_MUTATION = gql`
  mutation($input: AppInsertInput!) {
    insertOneApp(data: $input) {
      app_url
    }
  }
`;

export { APP_INSERT_ONE_MUTATION };
