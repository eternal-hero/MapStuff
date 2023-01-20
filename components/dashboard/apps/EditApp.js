import React, { Component, useState, useEffect } from "react";
import { useRouter } from "next/router";

import { APP_QUERY } from "../../../graphql/dashboard/apps/app.query";
import { APP_UPDATE_ONE_MUTATION } from "../../../graphql/dashboard/apps/app.mutation";
import { useQuery, useMutation } from "@apollo/client";

function FecthApp(props) {
  const { session, app_id } = props;
  const router = useRouter();

  const { loading, error, data } = useQuery(APP_QUERY, {
    variables: {
      input: {
        _id: app_id,
        created_by_id: session.user._id,
      },
    },
  });

  const [
    updateApp,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(APP_UPDATE_ONE_MUTATION);

  const [app_url, setAppUrl] = useState("");
  const [map_api_key, setMapApiKey] = useState("");

  useEffect(() => {
    if (!loading && data.app) {
      setAppUrl(data.app.app_url);
      setMapApiKey(data.app.map_api_key);
    }
  }, [loading, data]);

  const submit = (e) => {
    e.preventDefault();

    updateApp({
      variables: {
        query: {
          _id: app_id,
        },
        set: {
          app_url: app_url,
          map_api_key: map_api_key,
        },
        locationQuery: {
          app_id: app_id,
        },
        locationSet: {
          app_url: app_url,
        },
      },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return data.app ? (
    <>
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form action="#" method="POST" onSubmit={submit}>
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        App Url
                      </label>
                      <input
                        value={app_url}
                        onChange={(event) => setAppUrl(event.target.value)}
                        type="text"
                        name="first_name"
                        id="first_name"
                        autoComplete="given-name"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="map_api_key"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mapbox API key
                      </label>
                      <input
                        value={map_api_key}
                        onChange={(event) => setMapApiKey(event.target.value)}
                        type="password"
                        name="map_api_key"
                        id="map_api_key"
                        autoComplete="map_api_key"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      />
                    </div>
                    {/* <div className="col-span-6 sm:col-span-4">
                    <small><i>fields below are not yet working, need to review mapbox to know what is there datatype (array,string,int etc.)</i></small> 
                    </div> */}
                    {/* <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="map_bearing"
                        className="block text-sm font-medium text-red-700"
                      >
                        Map bearing
                      </label>
                      <input
                        readOnly
                        value={data.app.map_bearing}
                        type="text"
                        name="map_bearing"
                        id="map_bearing"
                        autoComplete="map_bearing"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="map_center"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Map center latitute
                      </label>
                      <input
                        readOnly
                        value={map_center_lat}
                        onChange={(event) =>
                          setMapCenterLat(event.target.value)
                        }
                        type="text"
                        name="map_center"
                        id="map_center"
                        autoComplete="map_center"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="map_center"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Map center longitude
                      </label>
                      <input
                        readOnly
                        value={map_center_long}
                        onChange={(event) =>
                          setMapCenterLong(event.target.value)
                        }
                        type="text"
                        name="map_center"
                        id="map_center"
                        autoComplete="map_center"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="map_glyphs"
                        className="block text-sm font-medium text-red-700"
                      >
                        Map glyphs
                      </label>
                      <input
                        readOnly
                        value={data.app.map_glyphs}
                        type="text"
                        name="map_glyphs"
                        id="map_glyphs"
                        autoComplete="map_glyphs"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="map_height"
                        className="block text-sm font-medium text-red-700"
                      >
                        Map height
                      </label>
                      <input
                        readOnly
                        value={data.app.map_height}
                        type="text"
                        name="map_height"
                        id="map_height"
                        autoComplete="map_height"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="map_layers"
                        className="block text-sm font-medium text-red-700"
                      >
                        Map layers
                      </label>
                      <input
                        readOnly
                        value={data.app.map_layers}
                        type="text"
                        name="map_layers"
                        id="map_layers"
                        autoComplete="map_layers"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      />
                    </div> */}
                  </div>
                </div>
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-500 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    {!mutationLoading && <p>Save</p>}
                    {mutationLoading && <p>Loading...</p>}
                    {mutationError && <p>Error :( Please try again</p>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  ) : (
    <small>
      <i>No data found!</i>
    </small>
  );
}
class EditApp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <FecthApp session={this.props.session} app_id={this.props.app_id} />;
  }
}

export default EditApp;
