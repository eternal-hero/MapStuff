import gql from 'graphql-tag'

const PLANS_QUERY = gql`
  query($query: PlansAclQueryInput) {
    plansAcls(query: $query) {
      _id
      name
      price_id
      cms {
        maxLocation
        mapBoxMapSettings {
          updateHeight
          provider
          marker
          zoomLevel
          header
          language
          filterButtonName
          fontColor1
          headingBackgroundColor
          mapStyles {
            enable
            label
            value
          }
        }
      }
    }
  }
`

export { PLANS_QUERY }
