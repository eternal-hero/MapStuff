import gql from "graphql-tag";

const LOCATION_QUERY = gql`
  query($input: LocationQueryInput) {
    location(query: $input) {
      _id
      app_url
      status
      name
      properties {
        address
        city
        country
        email
        phone
        postalCode
        state
        url
      }
      geometry {
        coordinates
      }
    }
  }
`;

const LOCATIONS_QUERY = gql`
  query($input: LocationQueryInput) {
    locations(query: $input) {
      _id
      app_url
      properties {
        address
        city
        country
      }
    }
  }
`;

const LOCATIONS_QUERY_CHECK_API_KEY = gql`
  query($input: LocationQueryInput, $app_input: AppQueryInput) {
    locations(query: $input) {
      _id
      app_url
      properties {
        address
        city
        country
      }
    }
    app(query: $app_input) {
      _id
    }
  }
`;

const LOCATIONS_MAP_QUERY = gql`
  query($input: LocationQueryInput) {
    locations(query: $input) {
      _id
      app_url
      properties {
        address
        city
        country
      }
      geometry {
        coordinates
      }
    }
  }
`;

export { LOCATION_QUERY, LOCATIONS_QUERY, LOCATIONS_MAP_QUERY,LOCATIONS_QUERY_CHECK_API_KEY };
