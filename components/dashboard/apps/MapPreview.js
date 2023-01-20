import React, { Component, useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useQuery } from "@apollo/client";

import { LOCATIONS_MAP_QUERY } from "../../../graphql/dashboard/admin/apps/location.query";

const ShowMap = () => {
  const router = useRouter();
  const { app_id } = router.query;

  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  const [locations, setLocations] = useState([]);

  const { loading, error, data } = useQuery(LOCATIONS_MAP_QUERY, {
    variables: { input: { app_url: app_id } },
  });

  useEffect(() => {
    if (!loading && data) {
      setLocations(data.locations);
      var locations = data.locations;

      mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
      const initializeMap = ({ setMap, mapContainer }) => {
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: process.env.MAPBOX_STYLE, // stylesheet location
          center: [0, 0],
          zoom: 2,
        });

        locations.forEach(function (location) {
          var marker = new mapboxgl.Marker()
            .setLngLat([
              location.geometry.coordinates[1],
              location.geometry.coordinates[0],
            ])
            .addTo(map);
        });

        map.on("load", () => {
          setMap(map);
          map.resize();
        });
      };

      if (!map) initializeMap({ setMap, mapContainer });
    }
  }, [map, loading, data]);

  return (
    <div>
      <div ref={(el) => (mapContainer.current = el)} className="mapContainer" />
    </div>
  );
};

class AddLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <ShowMap />;
  }
}

export default AddLocation;
