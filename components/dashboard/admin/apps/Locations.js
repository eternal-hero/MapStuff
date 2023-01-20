import React, { Component, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

import {
  LOCATIONS_QUERY_CHECK_API_KEY,
  LOCATION_QUERY,
} from "../../../../graphql/dashboard/admin/apps/location.query";
import {
  LOCATION_DELETE_ONE_MUTATION,
  LOCATION_UPDATE_ONE_MUTATION,
} from "../../../../graphql/dashboard/admin/apps/location.mutation";

import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import AppButton from "../../../../components/global/AppButton";
import AppSlideOverPanel from "../../../global/AppSlideOverPanel";
import AppForm from "../../../../components/global/AppForm";

import mapboxgl from "mapbox-gl";
import { useTranslation } from "react-i18next";

const FetchLocations = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { app_id } = router.query;
  /*AppSlideOverPanel handler*/
  const [isOpen, setIsOpen] = useState(false);
  const [locations_id, setLocationId] = useState(null);
  const [slideTitle, setSlideTitle] = useState("");
  const [slideContent, setSlideContent] = useState("");

  const EditForm = ({ id }) => {
    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);

    const { loading, error, data } = useQuery(LOCATION_QUERY, {
      variables: { input: { _id: id } },
    });

    const [
      updateLocation,
      { data: mutationData, loading: mutationLoading, error: mutationError },
    ] = useMutation(LOCATION_UPDATE_ONE_MUTATION);

    const [dateModified, setDateModified] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState("Published");
    const [dateAdded, setDateAdded] = useState("");

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

    const submit = () => {
      // addLocation({ variables: { input: allValues } });

      const input = {
        name: name,
        status: status,
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
          coordinates: [String(lat), String(lng)],
        },
      };
      console.log(input);
      updateLocation({
        variables: {
          query: {
            _id: id,
          },
          set: input,
        },
      });
    };

    return (
      <div>
        Longitude: {lng} | Latitude: {lat}
        <div
          ref={(el) => (mapContainer.current = el)}
          style={{ height: 500 }}
        />
        <AppForm formInput={FormInput} />
        <AppButton className="primary" label="Save" handleClick={submit} />
      </div>
    );
  };

  const ViewForm = ({ id }) => {
    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);

    const { loading, error, data } = useQuery(LOCATION_QUERY, {
      variables: { input: { _id: id } },
    });

    const [
      updateLocation,
      { data: mutationData, loading: mutationLoading, error: mutationError },
    ] = useMutation(LOCATION_UPDATE_ONE_MUTATION);

    const [dateModified, setDateModified] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState("Published");
    const [dateAdded, setDateAdded] = useState("");

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

    const submit = () => {
      // addLocation({ variables: { input: allValues } });

      const input = {
        name: name,
        status: status,
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
          coordinates: [String(lat), String(lng)],
        },
      };
      console.log(input);
      updateLocation({
        variables: {
          query: {
            _id: id,
          },
          set: input,
        },
      });
    };

    return (
      <div>
        {t("location.longitude")}: {lng} | {t("location.latitude")}: {lat}|{" "}
        <div
          ref={(el) => (mapContainer.current = el)}
          style={{ height: 500 }}
        />
        <AppForm formInput={FormInput} />
        <AppButton className="primary" label="Save" handleClick={submit} />
      </div>
    );
  };

  const { loading, error, data } = useQuery(LOCATIONS_QUERY_CHECK_API_KEY, {
    variables: {
      input: { app_url: app_id },
      app_input: {
        app_url: app_id,
        map_api_key_ne: "",
      },
    },
  });

  const [
    deleteLocation,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(LOCATION_DELETE_ONE_MUTATION);

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (!loading && data) {
      setLocations(data.locations);
    }
  }, [loading, data]);

  if (loading) return <p>{t("loading")}</p>;
  if (error) return <p>{error}</p>;
  return (
    <div>
      <AppSlideOverPanel
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={slideTitle}
        content={slideContent}
      />

      {!loading && data.app && <p>{t("location.map_box_key_added")}</p>}
      {!loading && !data.app && <p>{t("location.no_map_box_key")}</p>}
      <Link href={"/dashboard/admin/apps/" + app_id + "/locations/add"}>
        ADD
      </Link>

      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>{t("address")}</th>
            <th>{t("action")}</th>
          </tr>
        </thead>
        <tbody>
          {locations.map(({ _id, app_url, properties }) => {
            return (
              <tr key={_id}>
                <td>
                  {properties.address +
                    " " +
                    properties.city +
                    ", " +
                    properties.country}
                </td>
                <td>
                  <a  href="#"
                    className="text-sky-600 hover:text-sky-900 hover:cursor-pointer"
                    onClick={() => {
                      setIsOpen(!isOpen);
                      setSlideContent(<ViewForm id={_id} />);
                      setSlideTitle("View location details");
                    }}
                  >
                    {t("view")}
                  </a>
                  &nbsp;&nbsp;
                  <a
                    href="#"
                    onClick={() => {
                      setIsOpen(!isOpen);
                      setSlideContent(<EditForm id={_id} />);
                      setSlideTitle("Edit location details");
                    }}
                    className="text-sky-600 hover:text-sky-900 hover:cursor-pointer"
                  >
                    {t("edit")}
                  </a>
                  &nbsp;&nbsp;
                  <button onClick={(e) => deleteRow(_id, e)}>
                    {t("delete_row")}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  function deleteRow(_id, e) {
    /* CD (EV on 20210107): delete confirmation */
    if (confirm("Are you sure?") == true) {
      /* CD (EV on 20210107): delete location on realm app */
      deleteLocation({
        variables: {
          input: {
            _id: _id,
          },
        },
      });
      /* CD (EV on 20210107): delete location no refresh */
      const idToRemove = _id;
      var newLocations = locations.filter(function (item) {
        return item._id != idToRemove;
      });
      setLocations(newLocations);
    }
  }
};

class Locations extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <FetchLocations />
      </>
    );
  }
}

export default Locations;
