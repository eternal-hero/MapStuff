/* CD (EV on 20200205): import React*/
import { useState, useRef, useEffect } from "react";
/* CD (EV on 20200205): import Mapbox GL*/
import mapboxgl from "mapbox-gl";
/* CD (EV on 20200205): import Mapbox Geocoder*/
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
/* CD (EV on 20200205): import useMutation ApolloClient*/
import { useMutation } from "@apollo/client";
/* CD (EV on 20200205): import LOCATION_INSERT_ONE_MUTATION graphql*/
import { LOCATION_INSERT_ONE_MUTATION } from "../../../graphql/dashboard/admin/apps/location.mutation";
/* CD (EV on 20200205): import AppForm global component*/
import AppForm from "../../global/AppForm";
import AppBadge from "../../global/AppBadge";
import { stringify } from "postcss";
import { useTranslation } from "react-i18next";

const AddLocation = (props) => {
  /* CD (EV on 20200205): initialize props*/
  const {
    session,
    app_id,
    app_url,
    setIsOpen,
    setIsSuccess,
    locations,
    setLocations,
    handleClickViewLocation,
    handleClickEditLocation,
    handleClickDeleteLocation,
    setAppNotifContent,
    setAppNotifTitle,
  } = props;

  /* CD (EV on 20200205): initialize map */
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const { t } = useTranslation();

  /* CD (EV on 20200205): addLocation graphql */
  const [addLocation, { loading: mutationLoading, error: mutationError }] =
    useMutation(LOCATION_INSERT_ONE_MUTATION, {
      onCompleted(data) {
        if (data.insertOneLocation) {
          setIsOpen(false);
          setIsSuccess(true);
          setAppNotifContent(<p>{t("locations.new_location_added")}</p>);
          setAppNotifTitle(t("submitted"));
          const new_location = data.insertOneLocation;
          setLocations((locations) => [
            ...locations,
            [
              new_location.name,
              new_location.properties.address,
              new_location.properties.email,
              <AppBadge
                label={new_location.status}
                className={
                  new_location.status == "Published" ? "green" : "yellow"
                }
              />,
              <>
                <a  href="#"
                  className="cursor-pointer"
                  onClick={handleClickViewLocation(new_location._id)}
                >
                  {t("view")}
                </a>
                &nbsp; &nbsp;
                <a  href="#"
                  className="cursor-pointer"
                  onClick={handleClickEditLocation(new_location._id)}
                >
                  {t("edit")}
                </a>
                &nbsp; &nbsp;
                <a  href="#"
                  className="cursor-pointer"
                  onClick={handleClickDeleteLocation(new_location._id)}
                >
                  {t("delete")}
                </a>
              </>,
            ],
          ]);
        }
      },
    });

  /* CD (EV on 20200205): initialize set variable */
  const [dateModified, setDateModified] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState(true);
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

  /* CD (EV on 20200205): FormInput variable */
  const FormInput = [
    {
      type: "text",
      label: "Name",
      value: name,
      handleInput: (event) => setName(event.target.value),
    },
    {
      type: "text",
      label: "Address",
      value: address,
      handleInput: (event) => setAddress(event.target.value),
    },
    {
      type: "toggle",
      label: "Show Location on Map",
      value: status,
      handleInput: (event) => setStatus(event),
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
    /* CD (EV on 20200205): add mapbox accessToken */
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

    /* CD (EV on 20200205): declare initializeMap function */
    const initializeMap = ({ setMap, mapContainer }) => {
      /* CD (EV on 20200205): initialize map */
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: process.env.MAPBOX_STYLE, // stylesheet location
        center: [lng, lat],
        zoom: zoom,
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

      map.on("load", () => {
        /* CD (EV on 20210109): resize map*/
        setMap(map);
        map.resize();
      });
    };

    /* CD (EV on 20210109): if no map, initialize map*/
    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  /* CD (EV on 20200205): submit add location*/
  const submit = (e) => {
    e.preventDefault();
    const input = {
      app_id: app_id,
      app_url: app_url,
      type: "Feature",
      dateModified: dateModified,
      name: name,
      status: status ? "Published" : "Unpublished",
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
        coordinates: [String(lat), String(lng)],
      },
      created_by_id: session.user._id,
    };

    addLocation({ variables: { input: input } });
  };

  return (
    <div>
      <div className="sidebarStyle">
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div
        ref={(el) => (mapContainer.current = el)}
        className="mapContainer"
        style={{ height: 500 }}
        id="mapContainer"
      />

      <form action="#" method="POST" onSubmit={submit}>
        <AppForm formInput={FormInput} />
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
  );
};

export default AddLocation;
