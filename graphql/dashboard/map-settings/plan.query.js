import gql from 'graphql-tag'

const PLAN_QUERY = gql`
  query($query: PlansAclQueryInput) {
    plansAcl(query: $query) {
      name
      cms {
        mapBoxMapSettings {
          mapStyles {
            label
            value
            enable
          }
          provider
          updateHeight
          marker
          zoomLevel
          header
          language
          filterButtonName
          fontColor1
          headingBackgroundColor
        }
      }
    }
  }
`

export { PLAN_QUERY }
