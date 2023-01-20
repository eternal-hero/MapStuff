import React, { Component, useState } from "react";

import { APP_INSERT_ONE_MUTATION } from "../../../../graphql/dashboard/admin/apps/app.mutation";
import { useMutation } from "@apollo/client";
import AppButton from "../../../../components/global/AppButton";
import AppForm from "../../../../components/global/AppForm";

import AppNotification from "../../../../components/global/AppNotification";

function CreateApp(props) {
  const { session } = props;

  const [app_url, setAppUrl] = useState("");
  const [map_api_key, setMapApiKey] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);
  const [appNotifContent, setAppNotifContent] = useState(null);
  const [appNotifTitle, setAppNotifTitle] = useState(null);

  const FormInput = [
    {
      type: "text",
      label: "App Url",
      value: app_url,
      handleInput: (event) => setAppUrl(event.target.value),
    },
    {
      type: "password",
      label: "Mapbox API Key",
      value: map_api_key,
      handleInput: (event) => setMapApiKey(event.target.value),
    },
  ];

  const [
    addApp,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(APP_INSERT_ONE_MUTATION, {
    onCompleted(data) {
      if (data.insertOneApp) {
        setIsSuccess(true);
        setAppNotifContent(<p>Your new app has been added!</p>);
        setAppNotifTitle("SUBMITTED");
      }
    },
  });

  const submit = () => {
    setIsSuccess(false);
    var input = {
      app_url: app_url,
      map_api_key: map_api_key,
      created_by_id: session.user.sub.replace('auth0', ''),
      font_color_1: process.env.MAPBOX_FONT_COLOR_1,
      heading_background_color: process.env.MAPBOX_HEADING_BACKGROUND_COLOR,
      map_center: [process.env.MAPBOX_LAT, process.env.MAPBOX_LNG],
      map_height: process.env.MAPBOX_HEIGHT,
      map_zoom: process.env.MAPBOX_ZOOM,
      map_style: process.env.MAPBOX_STYLE.replace('mapbox://styles/mapbox/', ''),
    };

    addApp({ variables: { input: input } });
  };

  return (
    <form action="#" method="POST">
      <AppNotification
        isOpen={isSuccess}
        setIsOpen={setIsSuccess}
        content={appNotifContent}
        title={appNotifTitle}
      />
      <AppForm formInput={FormInput} />
      <AppButton
        className="primary"
        label={mutationLoading ? "Loading" : "Save"}
        handleClick={submit}
      />
    </form>
  );
}

class AddApp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <CreateApp session={this.props.session} />
      </>
    );
  }
}

export default AddApp;
