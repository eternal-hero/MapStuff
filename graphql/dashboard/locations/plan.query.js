import gql from "graphql-tag";

const PLAN_QUERY = gql`
  query($query: PlansAclQueryInput) {
    plansAcl(query: $query) {
      name
      cms {
        maxLocation
      }
    }
  }
`;

export { PLAN_QUERY };
