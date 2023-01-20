import { useState, useEffect, useRef, Fragment } from "react";
/* CD (EV on 20200205): import APPS_QUERY graphql */
import { APPS_QUERY } from "../../../graphql/dashboard/map-preview/app.query";
/* CD (EV on 20200205): import useQuery apollo client */
import { useQuery, useMutation } from "@apollo/client";

import { LOCATIONS_MAP_QUERY } from "../../../graphql/dashboard/map-preview/location.query";
import { APP_QUERY } from "../../../graphql/dashboard/map-preview/app.query";
import { USER_QUERY } from "../../../graphql/dashboard/map-preview/user.query";
import { APP_UPDATE_ONE_MUTATION } from "../../../graphql/dashboard/map-preview/app.mutation";

import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import AppModal from "../../global/AppModal";
import AppButton from "../../global/AppButton";
import Link from "next/link";
import AppNotification from "../../global/AppNotification";
/* CD (EV on 20200213): import AppForm */
import AppForm from "../../global/AppForm";
/* CD (JD on 20200826): import CopyToClipboard */
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useRole from "../../hooks/useRole";

import AppListBox from "../../global/AppListbox";
import { useTranslation } from "react-i18next";
const MapPreview = (props) => {
  const [selectedApp, setSelectedApp] = useState("");
  const [error, setError] = useState("");
  const { session, client } = props;
  const [role] = useRole(session);
  const { t } = useTranslation();

  /* CD (EV on 20200204): App Notif*/
  const [isSuccess, setIsSuccess] = useState(false);
  const [appNotifContent, setAppNotifContent] = useState(null);
  const [appNotifTitle, setAppNotifTitle] = useState(null);

  const SelectApp = () => {
    var query = { created_by_id: session?.user?.sub?.replace("auth0|", "") };

    /* CD (EV on 20200225): if admin query all apps*/
    if (role.includes("Admin") && client == undefined) {
      query = null;
    }

    /* CD (EV on 20200204): fetch apps*/
    const { loading, error, data } = useQuery(APPS_QUERY, {
      variables: {
        input: query,
      },
      client: client,
    });

    useEffect(() => {
      if (!selectedApp && !loading && data) {
        /* CD (EV on 20200204): set initial selected app*/
        setSelectedApp(data.apps[0]);
      }
    }, [loading, data, selectedApp]);

    if (loading) return "";
    if (error) return `Error! ${error.message}`;

    if (client) return "";
    return (
      <div>
        <AppListBox
          selected={selectedApp}
          setSelected={setSelectedApp}
          options={data.apps}
          displayName="_id"
          label={t("list_of_your_apps")}
        />
      </div>
    );
  };

  const CodeSnippet = () => {
    const [realm_api_key, setRealmApiKey] = useState("");
    const { t } = useTranslation();

    /* CD (EV on 20200205): fetch user*/
    const { loading, error, data } = useQuery(USER_QUERY, {
      variables: {
        input: { _id: session?.user?.sub?.replace("auth0|", "") },
      },
      client: client,
    });

    useEffect(() => {
      if (!loading && data) {
        setRealmApiKey(data.user.realm_api_key);
      }
    }, [loading, data]);

    if (loading) return "";
    if (error) return `Error! ${error.message}`;

    /* CD (JD on 20200826): Concat code string */
    const code = `${'<div id="map-mapstuff"></div>'} \n${'<script src="https://cdn.gangnam.club/widget/plugins.js"></script>'} \n${'<script src="https://cdn.gangnam.club/widget/mapbox2.js"  data-id="dev-store-locator-react" '}data-app="${
      selectedApp._id
    }" data-key="${realm_api_key}"></script>`

    return selectedApp && !client ? (
      <>
        {/* CD (JD on 20200826): Implement CopyToClipBoard  */}
        <CopyToClipboard text={code} onCopy={() => alert("Copied!")}>
          <a href="#">
            <AppButton label={t("copy_to_clipboard")} className="secondary" />
          </a>
        </CopyToClipboard>
        <div
          className="relative flex items-center px-6 py-5 m-10 space-x-3 overflow-scroll bg-white border border-gray-300 shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500"
          style={{ marginTop: "1em" }}
        >
          <pre>
            <code>{'<div id="map-mapstuff"></div>'}</code>
            <br />
            <code>
              {
                '<script src="https://cdn.gangnam.club/widget/plugins.js"></script>'
              }
            </code>
            <br />
            <code>
              {
                '<script src="https://cdn.gangnam.club/widget/mapbox2.js"  data-id="dev-store-locator-react" '
              }
            </code>
            <br />
            <code>
              {'data-app="' +
                selectedApp._id +
                '" data-key="' +
                realm_api_key +
                '"></script>'}
            </code>
          </pre>
        </div>
      </>
    ) : (
      ""
    );
  };

  const AddMapboxApiKeyField = () => {
    const { t } = useTranslation();

    const [map_api_key, setMapApiKey] = useState("");

    const [updateApp, { data, loading, error }] = useMutation(
      APP_UPDATE_ONE_MUTATION,
      {
        onCompleted(data) {
          if (data.updateOneApp) {
            setAppNotifContent(
              <p>{t("map-embedded-code.copy_embeded_code")}</p>
            );
            setAppNotifTitle();
            setIsSuccess(true);
            location.reload();
          }
        },
      }
    );
    const FormInput = [
      {
        type: "password",
        label: t("map-embedded-code.map_box_saved"),
        value: map_api_key,
        handleInput: (event) => setMapApiKey(event.target.value),
      },
    ];
    const submit = (e) => {
      var query = {
        _id: selectedApp._id,
      };
      var set = {
        map_api_key: map_api_key,
      };
      updateApp({
        variables: { query: query, set: set },
      });
    };

    return (
      <>
        <AppForm formInput={FormInput} />
        <AppButton
          className="primary"
          label={t("save")}
          handleClick={submit}
          disabled={map_api_key.length < 10}
        />
      </>
    );
  };

  return (
    <>
      <SelectApp />
      <br />
      {selectedApp.map_api_key != "" ? (
        <CodeSnippet />
      ) : (
        <div>
          <AppNotification
            isOpen={isSuccess}
            setIsOpen={setIsSuccess}
            content={appNotifContent}
            title={appNotifTitle}
          />
          <AddMapboxApiKeyField />
        </div>
      )}
    </>
  );
};

export default MapPreview;
