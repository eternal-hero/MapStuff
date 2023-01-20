import gql from "graphql-tag";

const LOCATIONS_QUERY = gql`
  query GetLocations($input: LocationQueryInput) {
    locations(query: $input, limit: 100000) {
      _id
      name
      status
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
      tags
    }
  }
`;

const LOCATION_DELETE = gql`
  mutation($query: LocationQueryInput!) {
    deleteOneLocation(query: $query) {
      app_id
    }
  }
`;

const LOCATION_INSERT_MANY = gql`
  mutation($data: [LocationInsertInput!]!) {
    insertManyLocations(data: $data) {
      insertedIds
    }
  }
`;

export { LOCATIONS_QUERY, LOCATION_DELETE,LOCATION_INSERT_MANY };
