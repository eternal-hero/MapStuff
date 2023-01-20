import React, { useEffect, useState, useRef } from "react";

import { useQuery, useMutation } from "@apollo/client";
// /* CD (EV on 20200204): import APPS_QUERY graphql */
import { APPS_QUERY } from "../../../graphql/dashboard/tags-and-filters/app.query";

import AppListBox from "../../global/AppListbox";
import ListofFilters from "./ListOfFilters";
import { useTranslation } from "react-i18next";
const Filters = (props) => {
  /* CD (EV on 20200204): declare session*/
  const { t } = useTranslation();
  const { session } = props;
  /* CD (EV on 20200204): initial selected app null*/
  const [selectedApp, setSelectedApp] = useState("");
  const SelectApp = () => {
    var query = { created_by_id: session.user.sub.replace("auth0|", "") };

    /* CD (EV on 20200225): if admin query all apps*/
    if (session.user.role_id == 1) {
      query = null;
    }
    /* CD (EV on 20200204): fetch apps*/
    const { loading, error, data } = useQuery(APPS_QUERY, {
      variables: {
        input: query,
      },
    });
    useEffect(() => {
      if (!selectedApp && !loading && data) {
        /* CD (EV on 20200204): set initial selected app*/
        setSelectedApp(data.apps[0]);
      }
    }, [loading, data, selectedApp]);

    if (loading) return "";
    if (error) return `Error! ${error.message}`;

    return (
      <div>
        <AppListBox
          selected={selectedApp}
          setSelected={setSelectedApp}
          options={data.apps}
          displayName="app_url"
          label={t("tags-and-filters.list_of_your_apps")}
        />
      </div>
    );
  };

  return (
    <div>
      <SelectApp />
      <ListofFilters filters={selectedApp.filters} app_id={selectedApp._id} />
    </div>
  );
};

export default Filters;
