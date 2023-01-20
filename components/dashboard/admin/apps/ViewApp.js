import React, { Component, useState, useEffect } from "react";
import { useRouter } from "next/router";

import { APP_QUERY } from "../../../../graphql/dashboard/admin/apps/app.query";
import { useQuery } from "@apollo/client";
import AppForm from "../../../../components/global/AppForm";
function ViewApp(props) {
  /* CD (EV on 20200204): declare app id*/
  const { id } = props;
  const { loading, error, data } = useQuery(APP_QUERY, {
    variables: { input: { _id: id } },
  });

  const [app_url, setAppUrl] = useState("");
  const [map_api_key, setMapApiKey] = useState("");
  const [map_zoom, setMapZoom] = useState("");
  const [map_height, setMapHeight] = useState("");
  const [map_latitude, setMapLatitude] = useState("");
  const [map_longitude, setMapLongitude] = useState("");
  const [map_font_color_1, setMapFont_color_1] = useState("");
  const [map_heading_background_color, setMapHeadingBackgroundColor] = useState(
    ""
  );

  const FormInput = [
    {
      type: "text",
      label: "App Url",
      value: app_url,
      disabled: true,
    },
    {
      type: "password",
      label: "Map Api Key",
      value: map_api_key,
      disabled: true,
    },
    {
      type: "text",
      label: "Map Zoom",
      value: map_zoom,
      disabled: true,
    },
    {
      type: "text",
      label: "Map Height",
      value: map_height,
      disabled: true,
    },
    {
      type: "text",
      label: "Map Latitude",
      value: map_latitude,
      disabled: true,
    },
    {
      type: "text",
      label: "Map Longitude",
      value: map_longitude,
      disabled: true,
    },
    {
      type: "color",
      label: "Map font_color_1",
      value: map_font_color_1,
      disabled: true,
    },
    {
      type: "color",
      label: "Map Heading Background Color",
      value: map_heading_background_color,
      disabled: true,
    },
  ];

  useEffect(() => {
    if (!loading && data) {
      console.log(data.app);
      /* CD (EV on 20210213): when data load, set form field values*/
      setAppUrl(data.app.app_url);
      setMapApiKey(data.app.map_api_key);
      setMapZoom(data.app.map_zoom);
      setMapHeight(data.app.map_height);
      setMapLatitude(data.app.map_center[0]);
      setMapLongitude(data.app.map_center[1]);
      setMapFont_color_1(data.app.font_color_1);
      setMapHeadingBackgroundColor(data.app.heading_background_color);
    }
  }, [loading, data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return data.app ? (
    <>
      <AppForm formInput={FormInput} />
    </>
  ) : (
    <small>
      <i>No data found!</i>
    </small>
  );
}

export default ViewApp;
