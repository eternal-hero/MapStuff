import gql from 'graphql-tag'

const USER_QUERY = gql`
  query {
    user(query: { email: "admin@cinnamon.digital" }) {
      realm_api_key
    }
  }
`

export { USER_QUERY }
