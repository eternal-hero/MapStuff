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
      heading_background_color
      font_color_1
      map_style
      map_header
      filter_button
      mapbox_language
    }
  }
`;

export { APP_QUERY };
