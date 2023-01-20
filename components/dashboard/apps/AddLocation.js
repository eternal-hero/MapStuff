import React, { Component, useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import { APP_QUERY } from "../../../graphql/dashboard/apps/app.query";
import { useMutation, useQuery } from "@apollo/client";
import { LOCATION_INSERT_ONE_MUTATION } from "../../../graphql/dashboard/admin/apps/location.mutation";
const CreateLocation = (props) => {
  const { session } = props;

  const router = useRouter();

  const { app_id } = router.query;

  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  const { loading, error, data } = useQuery(APP_QUERY, {
    variables: { input: { app_url: app_id, created_by_id: session.user._id } },
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
      created_by_id: session.user._id,
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
        style={{height:500}}
        id="mapContainer"
      />

      <form action="#" method="POST" onSubmit={submit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <br />
        <label htmlFor="status">Status:</label>
        <input
          type="text"
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        />
        <br />
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
        <br />
        <label htmlFor="city">City:</label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
        <br />
        <label htmlFor="state">State:</label>
        <input
          type="text"
          id="state"
          value={state}
          onChange={(event) => setState(event.target.value)}
        />
        <br />
        <label htmlFor="country">Country:</label>
        <input
          type="text"
          id="country"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
        />
        <br />
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <br />
        <label htmlFor="phone">Phone:</label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
        <br />
        <label htmlFor="postalCode">Postal code:</label>
        <input
          type="text"
          id="postalCode"
          value={postalCode}
          onChange={(event) => setPostalCode(event.target.value)}
        />
        <br />
        <label htmlFor="url">Url:</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <br />
        <label htmlFor="lat">Lat:</label>
        <input
          readOnly
          type="text"
          id="lat"
          value={lat}
          onChange={(event) => setLat(event.target.value)}
        />
        <br />
        <label htmlFor="long">Lng:</label>
        <input
          readOnly
          type="text"
          id="lng"
          value={lng}
          onChange={(event) => setLng(event.target.value)}
        />
        <br />
        <button
          type="submit"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-500 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          {!mutationLoading && <p>Save</p>}
          {mutationLoading && <p>Loading...</p>}
          {mutationError && <p>Error :( Please try again</p>}
        </button>
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
