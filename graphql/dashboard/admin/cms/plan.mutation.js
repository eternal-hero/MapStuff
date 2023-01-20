import gql from "graphql-tag";

const PLANS_MUTATION_UPDATE_MANY = gql`
  mutation($query: PlansAclQueryInput, $set: PlansAclUpdateInput!) {
    updateManyPlansAcls(query: $query, set: $set) {
      matchedCount
      modifiedCount
    }
  }
`;

export { PLANS_MUTATION_UPDATE_MANY };
