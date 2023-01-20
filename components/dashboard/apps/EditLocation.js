import React, { Component, useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import { APP_QUERY } from "../../../graphql/dashboard/admin/apps/app.query";
import { useMutation, useQuery } from "@apollo/client";

import { LOCATION_QUERY } from "../../../graphql/dashboard/admin/apps/location.query";
import { LOCATION_UPDATE_ONE_MUTATION } from "../../../graphql/dashboard/admin/apps/location.mutation";

import AppButton from "../../../components/global/AppButton";
import AppForm from "../../../components/global/AppForm";
import { useTranslation } from "react-i18next";

const UpdateLocation = (props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { app_id } = router.query;
  const { location_id } = props;

  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  const { loading, error, data } = useQuery(LOCATION_QUERY, {
    variables: { input: { app_url: app_id, _id: location_id } },
  });

  const [
    updateLocation,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(LOCATION_UPDATE_ONE_MUTATION);

  const [dateModified, setDateModified] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Published");
  const [dateAdded, setDateAdded] = useState("");

  const [_id, setId] = useState("");
  const [app_url, setAppUrl] = useState("");
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
      setId(data.location._id);
      setAppUrl(data.location.app_url);
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

        var marker = new mapboxgl.Marker({
          draggable: true,
        })
          .setLngLat([
            data.location.geometry.coordinates[1],
            data.location.geometry.coordinates[0],
          ])
          .addTo(map);

        function onDragEnd() {
          var lngLat = marker.getLngLat();

          setLat(lngLat.lat);
          setLng(lngLat.lng);
        }

        marker.on("dragend", onDragEnd);

        map.on("load", () => {
          setMap(map);
          map.resize();
        });
      };

      if (!map) initializeMap({ setMap, mapContainer });
    }
  }, [map, loading, data]);

  const submit = (e) => {
    e.preventDefault();
    // addLocation({ variables: { input: allValues } });

    const input = {
      app_url: app_id,
      type: "Feature",
      dateModified: dateModified,
      name: name,
      status: status,
      dateAdded: dateAdded,
      properties: {
        address: address,
        city: city,
        state: state,
        country: country,
        email: email,
        phone: phone,
        postalCode: postalCode,
        url: url,
      },
      geometry: {
        type: "Point",
        coordinates: [lat, lng],
      },
    };

    updateLocation({
      variables: {
        query: {
          _id: _id,
        },
        set: input,
      },
    });
  };

  return (
    <div>
      <div className="sidebarStyle">
        <div>
          {t("location.longitude")}: {lng} | {t("location.latitude")}: {lat}
        </div>
      </div>
      <div ref={(el) => (mapContainer.current = el)} style={{ height: 500 }} />

      <AppForm formInput={FormInput} />
      <AppButton className="primary" label={t("save")} handleClick={submit} />
    </div>
  );
};

class EditLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <UpdateLocation location_id={this.props.location_id}/>;
  }
}

export default EditLocation;
