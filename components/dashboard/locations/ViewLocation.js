/* CD (EV on 20210213): import react hooks */
import { useState, useRef, useEffect } from "react";
/* CD (EV on 20210213): import mapboxgl */
import mapboxgl from "mapbox-gl";
/* CD (EV on 20210213): import useMutation &  useQuery https://www.apollographql.com/docs/react/data/queries/ */
import { useMutation, useQuery } from "@apollo/client";
/* CD (EV on 20210213): import LOCATION_QUERY grapql*/
import { LOCATION_QUERY } from "../../../graphql/dashboard/admin/apps/location.query";
/* CD (EV on 20210213): import LOCATION_UPDATE_ONE_MUTATION grapql*/
import { LOCATION_UPDATE_ONE_MUTATION } from "../../../graphql/dashboard/admin/apps/location.mutation";
/* CD (EV on 20210213): import AppForm */
import AppForm from "../../../components/global/AppForm";
import { useTranslation } from "react-i18next";

const ViewLocation = (props) => {
  /* CD (EV on 20210213): declare the _id of location we want to view */
  const { location_id } = props;
  /* CD (EV on 20210213): initial map & mapContainer state */
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  /* CD (EV on 20210213): query the location */
  const { loading, error, data } = useQuery(LOCATION_QUERY, {
    variables: { input: { _id: location_id } },
  });

  /* CD (EV on 20210213): declare possible form fields, not all are being used */
  const { t } = useTranslation();
  const [dateModified, setDateModified] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Published");
  const [dateAdded, setDateAdded] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [url, setUrl] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [zoom, setZoom] = useState(15);

  /* CD (EV on 20210213): declare form input*/
  const FormInput = [
    {
      type: "text",
      label: t("location.name"),
      value: name,
      handleInput: (event) => setName(event.target.value),
    },
    {
      type: "text",
      label: t("location.street_address"),
      value: address,
      handleInput: (event) => setAddress(event.target.value),
    },
    {
      type: "text",
      label: t("location.status"),
      value: status,
      handleInput: (event) => setStatus(event.target.value),
    },
    {
      type: "text",
      label: t("location.city"),
      value: city,
      handleInput: (event) => setCity(event.target.value),
    },
    {
      type: "text",
      label: t("location.state"),
      value: state,
      handleInput: (event) => setState(event.target.value),
    },
    {
      type: "text",
      label: t("location.country"),
      value: country,
      handleInput: (event) => setCountry(event.target.value),
    },
    {
      type: "text",
      label: t("location.email"),
      value: email,
      handleInput: (event) => setEmail(event.target.value),
    },
    {
      type: "text",
      label: t("location.phone"),
      value: phone,
      handleInput: (event) => setPhone(event.target.value),
    },
    {
      type: "text",
      label: t("location.postal_code"),
      value: postalCode,
      handleInput: (event) => setPostalCode(event.target.value),
    },
    {
      type: "text",
      label: t("location.url"),
      value: url,
      handleInput: (event) => setUrl(event.target.value),
    },
    {
      type: "text",
      label: t("location.latitude"),
      value: lat,
      handleInput: (event) => setLat(event.target.value),
    },
    {
      type: "text",
      label: t("location.longitude"),
      value: lng,
      handleInput: (event) => setLng(event.target.value),
    },
  ];

  useEffect(() => {
    if (!loading && data) {
      /* CD (EV on 20210213): when data load, set form field values*/
      setName(data.location.name);
      setStatus(data.location.status);
      setAddress(data.location.properties.address);
      setCity(data.location.properties.city);
      setState(data.location.properties.state);
      setCountry(data.location.properties.country);
      setEmail(data.location.properties.email);
      setPhone(data.location.properties.phone);
      setPostalCode(data.location.properties.postalCode);
      setUrl(data.location.properties.url);
      setLat(data.location.geometry.coordinates[0]);
      setLng(data.location.geometry.coordinates[1]);

      /* CD (EV on 20210213): declare mapbox accessToken*/
      mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
      const initializeMap = ({ setMap, mapContainer }) => {
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: process.env.MAPBOX_STYLE, // stylesheet location
          center: [
            data.location.geometry.coordinates[1],
            data.location.geometry.coordinates[0],
          ],
          zoom: zoom,
        });

        /* CD (EV on 20210213): declare a marker that is draggable*/
        var marker = new mapboxgl.Marker({
          draggable: true /* CD (EV on 20210213): update to false if want to change to non draggable marker*/,
        })
          /* CD (EV on 20210213): set center of the marker*/
          .setLngLat([
            data.location.geometry.coordinates[1],
            data.location.geometry.coordinates[0],
          ])
          .addTo(map);

        /* CD (EV on 20210213): function : every time we drag the marker, update the lat and lng*/
        function onDragEnd() {
          var lngLat = marker.getLngLat();
          setLat(lngLat.lat);
          setLng(lngLat.lng);
        }
        /* CD (EV on 20210213): every time we drag the marker, update the lat and lng*/
        marker.on("dragend", onDragEnd);
        /* CD (EV on 20210213): map on load resize the map*/
        map.on("load", () => {
          setMap(map);
          map.resize();
        });
      };
      /* CD (EV on 20210213): if map is not initialize, initialize*/
      if (!map) initializeMap({ setMap, mapContainer });
    }
  }, [map, loading, data]);

  return (
    <div>
      <div className="sidebarStyle">
        <div>
          {t("location.longitude")}: {lng} | {t("location.latitude")}: {lat}
        </div>
      </div>
      <div ref={(el) => (mapContainer.current = el)} style={{ height: 500 }} />
      <AppForm formInput={FormInput} />
    </div>
  );
};

export default ViewLocation;
