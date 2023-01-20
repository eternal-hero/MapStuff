import React, { useState, useEffect } from "react";
import { APP_QUERY } from "../../../../graphql/dashboard/admin/apps/app.query";
import { APP_UPDATE_ONE_MUTATION } from "../../../../graphql/dashboard/admin/apps/app.mutation";
import { useQuery, useMutation } from "@apollo/client";
import AppButton from "../../../../components/global/AppButton";
import AppForm from "../../../../components/global/AppForm";

function EditApp(props) {
  const {
    id,
    setIsOpen,
    setIsSuccess,
    setAppNotifContent,
    setAppNotifTitle,
  } = props;
  console.log(props)
  const { loading, error, data } = useQuery(APP_QUERY, {
    variables: {
      input: {
        _id: id,
      },
    },
  });

  const [
    updateApp,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(APP_UPDATE_ONE_MUTATION, {
    onCompleted(data) {
      if (data.updateOneApp) {
        console.log("ok");
        setAppNotifContent(
          <p>Your changes have been applied to the location.</p>
        );
        setAppNotifTitle("CHANGES SAVED");
        setIsOpen(false);
        setIsSuccess(true);
        location.reload();
      }
    },
  });

  const [app_url, setAppUrl] = useState("");
  const [map_api_key, setMapApiKey] = useState("");
  const [map_zoom, setMapZoom] = useState("");
  const [map_height, setMapHeight] = useState("");
  const [map_latitude, setMapLatitude] = useState("");
  const [map_longitude, setMapLongitude] = useState("");
  const [map_font_color_1, setMapFontColor1] = useState("");
  const [map_heading_background_color, setMapHeadingBackgroundColor] = useState(
    ""
  );

  const FormInput = [
    {
      type: "text",
      label: "App Url",
      value: app_url,
      handleInput: (event) => setAppUrl(event.target.value),
    },
    {
      type: "password",
      label: "Map Api Key",
      value: map_api_key,
      handleInput: (event) => setMapApiKey(event.target.value),
    },
    {
      type: "text",
      label: "Map Zoom",
      value: map_zoom,
      handleInput: (event) => setMapZoom(event.target.value),
    },
    {
      type: "text",
      label: "Map Height",
      value: map_height,
      handleInput: (event) => setMapHeight(event.target.value),
    },
    {
      type: "text",
      label: "Map Latitude",
      value: map_latitude,
      handleInput: (event) => setMapLatitude(event.target.value),
    },
    {
      type: "text",
      label: "Map Longitude",
      value: map_longitude,
      handleInput: (event) => setMapLongitude(event.target.value),
    },
    {
      type: "color",
      label: "Map font_color_1",
      value: map_font_color_1,
      handleInput: (event) => setMapFontColor1(event.target.value),
    },
    {
      type: "color",
      label: "Map Heading Background Color",
      value: map_heading_background_color,
      handleInput: (event) => setMapHeadingBackgroundColor(event.target.value),
    },
  ];

  useEffect(() => {
    if (!loading && data.app) {
      console.log(data.app);
      setAppUrl(data.app.app_url);
      setMapApiKey(data.app.map_api_key);
      setMapZoom(data.app.map_zoom);
      setMapHeight(data.app.map_height);
      setMapLatitude(data.app.map_center[0]);
      setMapLongitude(data.app.map_center[1]);
      setMapFontColor1(data.app.font_color_1);
      setMapHeadingBackgroundColor(data.app.heading_background_color);
    }
  }, [loading, data]);

  const submit = () => {
    var input = {
      query: {
        _id: id,
      },
      set: {
        app_url: app_url,
        map_api_key: map_api_key,
        map_zoom: map_zoom,
        map_height: map_height,
        map_center: [map_latitude, map_longitude],
        font_color_1: map_font_color_1,
        heading_background_color: map_heading_background_color,
      },
      locationQuery: {
        app_id: id,
      },
      locationSet: {
        app_url: app_url,
      },
    };
    console.log(input);
    updateApp({
      variables: input,
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return data.app ? (
    <>
      <form action="#" method="POST">
        <AppForm formInput={FormInput} />
        <AppButton
          className="primary"
          label={mutationLoading ? "Loading" : "Save"}
          handleClick={submit}
        />
      </form>
    </>
  ) : (
    <small>
      <i>No data found!</i>
    </small>
  );
}

export default EditApp;
