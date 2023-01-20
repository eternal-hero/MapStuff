import gql from "graphql-tag";

const LOCATION_UPDATE_ONE_MUTATION = gql`
  mutation($query: LocationQueryInput, $set: LocationUpdateInput!) {
    updateOneLocation(query: $query, set: $set) {
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
    }
  }
`;

const LOCATION_INSERT_ONE_MUTATION = gql`
  mutation($input: LocationInsertInput!) {
    insertOneLocation(data: $input) {
      _id
      name
      properties{
        address
        city
        country
        email
        phone
        postalCode
        state
        url
      }
      status
      tags
    }
  }
`;

const LOCATION_DELETE_ONE_MUTATION = gql`
  mutation($input: LocationQueryInput!) {
    deleteOneLocation(query: $input) {
      app_url
    }
  }
`;

export {
  LOCATION_UPDATE_ONE_MUTATION,
  LOCATION_INSERT_ONE_MUTATION,
  LOCATION_DELETE_ONE_MUTATION,
};
