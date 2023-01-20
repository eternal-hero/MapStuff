import gql from "graphql-tag";

const APP_QUERY = gql`
  query ($input: AppQueryInput) {
    app(query: $input) {
      _id
      app_url
      map_api_key
      map_zoom
      map_height
      map_center
      font_color_1
      heading_background_color
      map_header
      filter_button
      mapbox_language
    }
  }
`;

const APPS_QUERY = gql`
  query {
    apps {
      _id
      app_url
    }
  }
`;

export { APP_QUERY, APPS_QUERY };
