import gql from "graphql-tag";

const LOCATIONS_MAP_QUERY = gql`
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
      tags
    }
  }
`;

export { LOCATIONS_MAP_QUERY };
