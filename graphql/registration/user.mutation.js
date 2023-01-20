import gql from "graphql-tag";

const USER_INSERT_ONE_MUTATION = gql`
  mutation($data: UserInsertInput!) {
    insertOneUser(data: $data) {
      email
      _id
    }
  }
`;

export { USER_INSERT_ONE_MUTATION };
