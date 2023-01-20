import React, { Component, useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import { APP_QUERY } from "../../../../graphql/dashboard/admin/apps/app.query";
import { useMutation, useQuery } from "@apollo/client";
import { LOCATION_INSERT_ONE_MUTATION } from "../../../../graphql/dashboard/admin/apps/location.mutation";
import AppButton from "../../../../components/global/AppButton";
import AppForm from "../../../global/AppForm";
const CreateLocation = (props) => {
  const { session } = props;

  const router = useRouter();

  const { app_id } = router.query;

  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  const { loading, error, data } = useQuery(APP_QUERY, {
    variables: { input: { app_url: app_id } },
  });

  const [
    addLocation,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(LOCATION_INSERT_ONE_MUTATION);

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
  const [zoom, setZoom] = useState(2);

  const FormInput = [
    {
      type: "text",
      label: "Name",
      value: name,
      handleInput: (event) => setName(event.target.value),
    },
    {
      type: "text",
      label: "Status",
      value: status,
      handleInput: (event) => setStatus(event.target.value),
    },
    {
      type: "text",
      label: "City",
      value: city,
      handleInput: (event) => setCity(event.target.value),
    },
    {
      type: "text",
      label: "State",
      value: state,
      handleInput: (event) => setState(event.target.value),
    },
    {
      type: "text",
      label: "Country",
      value: country,
      handleInput: (event) => setCountry(event.target.value),
    },
    {
      type: "text",
      label: "Email",
      value: email,
      handleInput: (event) => setEmail(event.target.value),
    },
    {
      type: "text",
      label: "Phone",
      value: phone,
      handleInput: (event) => setPhone(event.target.value),
    },
    {
      type: "text",
      label: "Postal Code",
      value: postalCode,
      handleInput: (event) => setPostalCode(event.target.value),
    },
    {
      type: "text",
      label: "Url",
      value: url,
      handleInput: (event) => setUrl(event.target.value),
    },
    {
      type: "text",
      label: "Latitude",
      value: lat,
      handleInput: (event) => setLat(event.target.value),
    },
    {
      type: "text",
      label: "Longitude",
      value: lng,
      handleInput: (event) => setLng(event.target.value),
    },
  ];

  useEffect(() => {
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: process.env.MAPBOX_STYLE, // stylesheet location
        center: [lng, lat],
        zoom: zoom,
      });

      const marker = new mapboxgl.Marker({
        draggable: true,
      });

      var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        marker: false,
        mapboxgl: mapboxgl,
      });

      map.addControl(geocoder);
      /* CD (EV on 20210109): if the user click on the one of the result of the geocoder  */
      geocoder.on("result", (e) => {
        setCountry("");
        setState("");
        setPostalCode("");
        setCity("");
        setAddress("");
        var vm = this;
        /* CD (EV on 20210109): add a marker setLngLat to the center of the result (selected place)  */
        marker.setLngLat(e.result.center).addTo(map);
        /* CD (EV on 20210109): Reactive Lng and Lat */
        var lngLat = marker.getLngLat();
        setLat(lngLat.lat);
        setLng(lngLat.lng);

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
          } else if (value.id.match(/locality.*/)) {
            // vm.$parent.form.address.streetAddress = typeof data.result.properties.address !== "undefined" ?
            // data.result.properties.address + ", "+ value.text :value.text

            setAddress(
              typeof e.result.properties.address !== "undefined"
                ? e.result.properties.address + ", " + value.text
                : value.text
            );
          } else if (value.id.match(/neighborhood.*/)) {
          } else if (value.id.match(/address.*/)) {
          } else if (value.id.match(/poi.*/)) {
          }
        }

        e.result.context.forEach(getAddressByType);
      });

      marker.on("dragend", () => {
        /* CD (EV on 20210109): get the lngLat of the marker */
        var lngLat = marker.getLngLat();
        setLat(lngLat.lat);
        setLng(lngLat.lng);
      });

      map.on("load", () => {
        setMap(map);
        map.resize();
      });
    };

    if (!map && !loading && data.app) initializeMap({ setMap, mapContainer });
  }, [map, loading, data]);

  const submit = () => {
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
      created_by_id: session.user.sub.replace('auth0|', ''),
      app_id: data.app._id,
    };

    addLocation({ variables: { input: input } });
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return data.app ? (
    <div>
      <div className="sidebarStyle">
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div
        ref={(el) => (mapContainer.current = el)}
        className="mapContainer"
        id="mapContainer"
        style={{height:500}}
      />

      <form action="#" method="POST">
        <AppForm formInput={FormInput} />
        <AppButton label="Save" className="primary" handleClick={submit} />
      </form>
    </div>
  ) : (
    "no data found"
  );
};

class AddLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <CreateLocation session={this.props.session} />;
  }
}

export default AddLocation;
