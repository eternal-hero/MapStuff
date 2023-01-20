import { useMutation, useQuery } from "@apollo/client";

import Select from "react-select";

import { useState, useEffect } from "react";
/* CD (EV on 20200205): import LOCATION_INSERT_ONE_MUTATION graphql*/
import { LOCATION_INSERT_ONE_MUTATION } from "../../../graphql/dashboard/admin/apps/location.mutation";

import AppFormField from "../../global/AppFormField";
import AppButton from "../../global/AppButton";
import AppToggle from "../../global/AppToggle";

import MapPreview from "./MapPreview";
import { useUser } from '@auth0/nextjs-auth0';
import { useTranslation } from "react-i18next";

const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const groupBadgeStyles = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center",
};

const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const AddLocation = (props) => {
  const {
    filters,
    app_id,
    locations,
    setLocations,
    setSliderOpen,

    setNotificationOpen,
    setNotificationContent,
    setNotificationTitle,
  } = props;

  const { user } = useUser();

  const [name, setName] = useState("");
  const [status, setStatus] = useState(false);
  const [dateAdded, setDateAdded] = useState("");
  const [dateModified, setDateModified] = useState("");

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
  const [tags, setTags] = useState([]);
  const [zoom, setZoom] = useState(2);
  const { t } = useTranslation();

  /* CD (EV on 20200205): addLocation graphql */
  const [addLocation, { loading: mutationLoading, error: mutationError }] =
    useMutation(LOCATION_INSERT_ONE_MUTATION, {
      onCompleted(data) {
        if (data.insertOneLocation) {
          console.log(data);

          let newLocations = [...locations]; // copying the old datas array
          newLocations.push({
            _id: data.insertOneLocation._id,
            name: data.insertOneLocation.name,
            properties: {
              email: data.insertOneLocation.properties.email,
              address: data.insertOneLocation.properties.address,
              city: data.insertOneLocation.properties.city,
              state: data.insertOneLocation.properties.state,
              country: data.insertOneLocation.properties.country,
              postalCode: data.insertOneLocation.properties.postalCode,
              email: data.insertOneLocation.properties.email,
              phone: data.insertOneLocation.properties.phone,
              url: data.insertOneLocation.properties.url,
            },
            status: data.insertOneLocation.status,
            tags: data.insertOneLocation.tags.map((tag) => {
              return tag;
            }),
          });
  
          setLocations(newLocations);
          setSliderOpen(false);

          setNotificationOpen(true);
          setNotificationContent(<p>{t("locations.new_location_added")}</p>);
          setNotificationTitle(t("submitted"));
        }
      },
    });

  const onGeoCodeClick = async () => {
    var base_url = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
    var location_address =
      encodeURIComponent(address) +
      " " +
      encodeURIComponent(city) +
      " " +
      encodeURIComponent(state) +
      " " +
      encodeURIComponent(postalCode) +
      ".json?";

    var parameters =
      "types=address&access_token=" + process.env.MAPBOX_ACCESS_TOKEN;
    var query = base_url + location_address + parameters;

    var res = await fetch(query);
    var data = await res.json();
    if (data.features.length > 0) {
      setLat(data.features[0].geometry.coordinates[1]);
      setLng(data.features[0].geometry.coordinates[0]);
    } else {
      setLat("");
      setLng("");
    }
  };

  async function handleClickSaveLocation(e) {
    e.preventDefault();

    const input = {
      app_id: app_id,
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
      created_by_id: user.sub.replace("auth0|", ""),
      tags: tags.map((tag) => {
        return tag.value;
      }),
    };

    addLocation({ variables: { input: input } });
  }

  return (
    <div>
      <MapPreview
        zoom={zoom}
        lat={lat}
        lng={lng}
        setCountry={setCountry}
        setState={setState}
        setPostalCode={setPostalCode}
        setCity={setCity}
        setAddress={setAddress}
        setLat={setLat}
        setLng={setLng}
      />
      <form onSubmit={handleClickSaveLocation}>
        <AppFormField
          value={name}
          label={t("name")}
          onChange={(event) => setName(event.target.value)}
          required={true}
        />

        <AppFormField
          value={address}
          label={t("street_address")}
          onChange={(event) => setAddress(event.target.value)}
          required={false}
        />
        <AppFormField
          value={city}
          label={t("city")}
          onChange={(event) => setCity(event.target.value)}
          required={true}
        />
        <AppFormField
          value={state}
          label={t("state")}
          onChange={(event) => setState(event.target.value)}
          required={true}
        />
        <AppFormField
          value={country}
          label={t("country")}
          onChange={(event) => setCountry(event.target.value)}
          required={true}
        />
        <AppFormField
          value={postalCode}
          label={t("postal_code")}
          onChange={(event) => setPostalCode(event.target.value)}
          required={true}
        />
        <AppButton
          label={t("geocode")}
          handleClick={onGeoCodeClick}
          type="button"
          className="primary"
        />
        <AppFormField
          value={lat}
          label={t("latitude")}
          onChange={(event) => setLat(event.target.value)}
          required={true}
        />
        <AppFormField
          value={lng}
          label={t("longitude")}
          onChange={(event) => setLng(event.target.value)}
          required={true}
        />
        <AppFormField
          type="email"
          value={email}
          label={t("email")}
          onChange={(event) => setEmail(event.target.value)}
          required={false}
        />
        <AppFormField
          value={phone}
          label={t("phone")}
          onChange={(event) => setPhone(event.target.value)}
          required={false}
        />

        <AppFormField
          value={url}
          label={t("url")}
          onChange={(event) => setUrl(event.target.value)}
          required={false}
        />

        <label htmlFor="">
          {t("tags")}
          <Select
            isMulti
            name="tags"
            value={tags}
            onChange={setTags}
            // CD (JD on 20210908): validate if filter is null
            options={
              filters
                ? filters.map((filter) => {
                    return {
                      label: filter.title,
                      options: filter.tags.map((tag) => {
                        return {
                          value: tag,
                          label: tag,
                        };
                      }),
                    };
                  })
                : []
            }
            formatGroupLabel={formatGroupLabel}
          />
        </label>

        <br />
        <AppToggle
          label={t("locations.show_location_on_map")}
          value={status}
          onChange={(event) => setStatus(event)}
        />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <AppButton type="submit" label={t("save")} className="primary" />
        <br />
        <br />
      </form>
    </div>
  );
};
export default AddLocation;
