import gql from "graphql-tag";

const APPS_QUERY = gql`
  query ($input: AppQueryInput) {
    apps(query: $input) {
      _id
      app_url
      map_api_key
      map_zoom
      map_height
      map_center
      heading_background_color
      font_color_1
      map_style
      marker_color
      map_header
      filter_button
      mapbox_language
    }
  }
`;

const APP_UPDATE_ONE_MUTATION = gql`
  mutation($query: AppQueryInput, $set: AppUpdateInput!) {
    updateOneApp(query: $query, set: $set) {
      _id
    }
  }
`;

export { APPS_QUERY, APP_UPDATE_ONE_MUTATION };
