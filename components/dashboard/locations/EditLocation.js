import { useMutation, useQuery } from "@apollo/client";

import Select from "react-select";

import { useState, useEffect } from "react";
import {
  LOCATION_QUERY,
  LOCATION_UPDATE_ONE_MUTATION,
} from "../../../graphql/dashboard/admin/apps/location.query";

import AppFormField from "../../global/AppFormField";
import AppButton from "../../global/AppButton";
import AppToggle from "../../global/AppToggle";

import MapPreview from "./MapPreview";

import UpgradePlanModalContent from "./UpgradePlanModalContent";
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

const EditLocation = (props) => {
  const {
    location,
    locations,
    index,

    setLocations,
    setSliderOpen,

    filters,

    locationsLimit,

    setModalOpen,
    setModaltitle,
    setModalContent,
    setModalFooter,

    setNotificationOpen,
    setNotificationContent,
    setNotificationTitle,
  } = props;

  let locationsCount = locations.filter((location) => {
    return location.status == "Published";
  }).length;
  if (location.status == "Unpublished") {
    ++locationsCount;
  }

  const { t } = useTranslation();

  const [
    updateLocation,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(LOCATION_UPDATE_ONE_MUTATION, {
    onCompleted(data) {
      if (data.updateOneLocation) {
        let newLocations = [...locations]; // copying the old datas array
        newLocations[index] = {
          _id: data.updateOneLocation._id,
          name: data.updateOneLocation.name,
          properties: {
            email: data.updateOneLocation.properties.email,
            address: data.updateOneLocation.properties.address,
          },
          status: data.updateOneLocation.status,
          tags: data.updateOneLocation.tags.map((tag) => {
            return tag;
          }),
        };

        setLocations(newLocations);
        setSliderOpen(false);

        setNotificationOpen(true);
        setNotificationContent(<p>{t("locations.changes_applied")}</p>);
        setNotificationTitle(t("locations.changes_saved"));
      }
    },
  });

  const { loading, error, data } = useQuery(LOCATION_QUERY, {
    variables: { input: { _id: location._id } },
    fetchPolicy: "no-cache",
  });

  const [name, setName] = useState("");
  const [status, setStatus] = useState(
    location.status == "Published" ? true : false
  );
  const [dateAdded, setDateAdded] = useState("");
  const [fetchInProgress, setFetchInProgress] = useState(true);

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
  // CD (JD on 20210827): set zoom value
  const [zoom, setZoom] = useState(5);

  const groupedOptions = filters?.map((filter) => {
    return {
      label: filter.title,
      options: filter.tags.map((tag) => {
        return {
          value: tag,
          label: tag,
        };
      }),
    };
  });

  useEffect(() => {
    if (!loading && data.location) {
      setName(data.location.name);
      setStatus(data.location.status == "Published" ? true : false);
      setAddress(data.location?.properties?.address || "");
      setCity(data.location.properties.city);
      setState(data.location.properties.state);
      setCountry(data.location.properties.country);
      setEmail(data.location.properties.email);
      setPhone(data.location.properties.phone);
      setPostalCode(data.location.properties.postalCode);
      setUrl(data.location.properties.url);
      setLat(data.location.geometry.coordinates[0]);
      setLng(data.location.geometry.coordinates[1]);
      setTags(
        data.location.tags.map((tag) => {
          return {
            value: tag,
            label: tag,
          };
        })
      );
      setFetchInProgress(false);
    }
  }, [loading, data]);

  async function handleClickSaveLocation(e) {
    e.preventDefault();

    const query = {
      _id: location._id,
    };

    const set = {
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
        coordinates: [lat, lng],
      },
      tags: tags.map((tag) => {
        return tag.value;
      }),
    };

    if (set.status == "Unpublished") {
      --locationsCount;
    }
    console.log(locationsCount);
    if (locationsLimit >= locationsCount || locationsLimit == 0) {
      updateLocation({
        variables: {
          query: query,
          set: set,
        },
      });
    } else {
      setModalOpen(true);
      const title = "Lorem Ipsum";
      setModaltitle(title);
      setModalContent(<UpgradePlanModalContent />);
      setModalFooter(null);
    }
  }

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

  if (loading && !data) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <>
      {/* add checking if fetching is in progress */}
      {fetchInProgress ? null : (
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
      )}
      <form onSubmit={handleClickSaveLocation}>
        <AppFormField
          value={name}
          label={t("location.name")}
          onChange={(event) => setName(event.target.value)}
          required={true}
        />

        <AppFormField
          value={address}
          label={t("location.street_address")}
          onChange={(event) => setAddress(event.target.value)}
          required={false}
        />
        <AppFormField
          value={city}
          label={t("location.city")}
          onChange={(event) => setCity(event.target.value)}
          required={true}
        />
        <AppFormField
          value={state}
          label={t("location.state")}
          onChange={(event) => setState(event.target.value)}
          required={true}
        />
        <AppFormField
          value={country}
          label={t("location.country")}
          onChange={(event) => setCountry(event.target.value)}
          required={true}
        />
        <AppFormField
          value={postalCode}
          label={t("location.postal_code")}
          onChange={(event) => setPostalCode(event.target.value)}
          required={true}
        />
        <AppButton
          label={t("location.geocode")}
          handleClick={onGeoCodeClick}
          type="button"
          className="primary"
        />
        <AppFormField
          value={lat}
          label={t("location.latitude")}
          onChange={(event) => setLat(event.target.value)}
          required={true}
        />
        <AppFormField
          value={lng}
          label={t("location.longitude")}
          onChange={(event) => setLng(event.target.value)}
          required={true}
        />
        <AppFormField
          type="email"
          value={email}
          label={t("location.email")}
          onChange={(event) => setEmail(event.target.value)}
          required={false}
        />
        <AppFormField
          value={phone}
          label={t("location.phone")}
          onChange={(event) => setPhone(event.target.value)}
          required={false}
        />
        <AppFormField
          value={url}
          label={t("location.url")}
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
            options={groupedOptions}
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
    </>
  );
};
export default EditLocation;
