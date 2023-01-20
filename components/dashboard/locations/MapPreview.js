import React, { useEffect, useState, useRef } from "react";
/* CD (EV on 20200205): import Mapbox GL*/
import mapboxgl from "mapbox-gl";
/* CD (EV on 20200205): import Mapbox Geocoder*/
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

const MapPreview = (props) => {
  const {
    zoom,
    lng,
    lat,

    setCountry,
    setState,
    setPostalCode,
    setCity,
    setAddress,
    setLat,
    setLng,
  } = props;


  /* CD (EV on 20200205): initialize map */
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
    const [activeMarkers, setActiveMarkers] = useState([]);

  useEffect(() => {
    /* CD (EV on 20200205): add mapbox accessToken */
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
   

    /* CD (EV on 20200205): declare initializeMap function */
    const initializeMap = ({ setMap, mapContainer }) => {
      
      if(!map){
      /* CD (EV on 20200205): initialize map */
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: process.env.MAPBOX_STYLE, // style URL
        center: [lng, lat], // starting position [lng, lat]
        zoom: 15, // starting zoom
      });

      /* CD (EV on 20200205): initialize marker */
      const marker = new mapboxgl.Marker({
        draggable: true,
      });

      /* CD (EV on 20200205): initialize geocoder */
      var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        marker: false,
        mapboxgl: mapboxgl,
        reverseGeocode: true
      });

      /* CD (EV on 20200205): add geocoder to map */
      map.addControl(geocoder);

      /* CD (EV on 20210109): if the user click on the one of the result of the geocoder  */
      geocoder.on("result", (e) => {
        /* CD (EV on 20200205): reinitilize form variable after search */
        setCountry("");
        setState("");
        setPostalCode("");
        setCity("");
        setAddress("");

      activeMarkers.forEach(function (marker) {
                  marker.remove();
                });

        /* CD (EV on 20200205): vm = this*/
        var vm = this;
        /* CD (EV on 20210109): add a marker setLngLat to the center of the result (selected place)  */
        marker.setLngLat(e.result.center).addTo(map);
        /* CD (EV on 20210109): Reactive Lng and Lat */
        var lngLat = marker.getLngLat();
        /* CD (EV on 20200205): set lat and lng to center of map*/
        setLat(lngLat.lat);
        setLng(lngLat.lng);

        /* CD (EV on 20200205): intiialize  ( getAddressByType ) will get address from mapbox geocoder and set to form variable*/
        function getAddressByType(value, index, array) {
          if (value.id.match(/country.*/)) {
            setCountry(value.text);
          } else if (value.id.match(/region.*/)) {
            setState(value.text);
          } else if (value.id.match(/postcode.*/)) {
            setPostalCode(value.text);
          } else if (value.id.match(/district.*/)) {
          } else if (value.id.match(/place.*/)) {
            setCity(value.text);
          } else if (value.id.match(/neighborhood.*/)) {
          } else if (value.id.match(/address.*/)) {
          } else if (value.id.match(/poi.*/)) {
          }
        }

        /* CD (EV on 20200205): get address from mapbox geocoder and set to form variable*/
        e.result.context.forEach(getAddressByType);
        // setAddress(e.result.place_name);
        console.log(JSON.stringify(e));
      });
      
  
      

      marker.on("dragend", () => {
        /* CD (EV on 20210109): get the lngLat of the marker when change position*/
        var lngLat = marker.getLngLat();
        setLat(lngLat.lat);
        setLng(lngLat.lng);
      });

      map.on("load", function (e) {
        if(lat !== '' && lng !==''){
            // geocoder.query(`${lat} ${lng}`);
const marker1 = new mapboxgl.Marker({
  draggable: true
}) // initialize a new marker
  .setLngLat([lng, lat]) // Marker [lng, lat] coordinates
  .addTo(map);
  setActiveMarkers(activeMarkers.push(marker1))

   marker1.on("dragend", () => {
        /* CD (EV on 20210109): get the lngLat of the marker when change position*/
        var lngLat = marker1.getLngLat();
        setLat(lngLat.lat);
        setLng(lngLat.lng);
      });

          }
        })
      } 
    };
    /* CD (EV on 20210109): if no map, initialize map*/
    if (!map) initializeMap({ setMap, mapContainer });
  }, []);



  return (
    <div>
      <div className="sidebarStyle">
        <div>{/* Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} */}</div>
      </div>
      <div ref={(el) => (mapContainer.current = el)} style={{ height: 500 }} />
    </div>
  );
};

export default MapPreview;
