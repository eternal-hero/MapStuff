import gql from "graphql-tag";

const LOCATIONS_QUERY = gql`
  query($input: LocationQueryInput) {
    locations(query: $input) {
      _id
      app_url
      type
      name
      properties {
        address
        city
        country
        url
        postalCode
        email
        phone
        state
      }
      geometry {
        coordinates
      }
    }
  }
`;

export { LOCATIONS_QUERY };
