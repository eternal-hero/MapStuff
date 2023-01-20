import gql from "graphql-tag";

const LOCATIONS_QUERY = gql`
  query($input: LocationQueryInput) {
    locations(query: $input) {
      name
      status
      properties {
        address
        email
      }
    }
  }
`;

export { LOCATIONS_QUERY };
