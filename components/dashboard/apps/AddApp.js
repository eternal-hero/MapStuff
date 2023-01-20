import React, { Component, useState } from "react";

import { APP_INSERT_ONE_MUTATION } from "../../../graphql/dashboard/apps/app.mutation";
import { useMutation } from "@apollo/client";

function CreateApp(props) {
  const { session } = props;

  
  const [app_url, setAppUrl] = useState("");
  const [map_api_key, setMapApiKey] = useState("");

  const [
    addApp,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(APP_INSERT_ONE_MUTATION);

  const submit = (e) => {
    e.preventDefault();
    var input = {
      app_url: app_url,
      map_api_key: map_api_key,
      created_by_id: session.user._id,
    };
 
    addApp({ variables: { input: input } });
  };

  return (
    <form action="#" method="POST" onSubmit={submit}>
      <label>
        App Url:
        <input
          type="text"
          value={app_url}
          onChange={(event) => setAppUrl(event.target.value)}
        />
      </label>
      <br />
      <br />
      <label>
        Mapbox Api key:
        <input
          type="password"
          value={map_api_key}
          onChange={(event) => setMapApiKey(event.target.value)}
        />
      </label>
      <br />
      <br />

      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      >
        {!mutationLoading && <p>Save</p>}
        {mutationLoading && <p>Loading...</p>}
        {mutationError && <p>Error :( Please try again</p>}
      </button>
    </form>

    // <form action="#" method="POST" onSubmit={submit}>
    //   <label htmlFor="app_url">App url:</label>
    //   <br />
    //   <input type="text" id="app_url" onChange={changeHandler} name="app_url" />
    //   <br />
    //   <label htmlFor="map_api_key">Mapbox api key:</label>
    //   <br />
    //   <input
    //     type="password"
    //     id="map_api_key"
    //     onChange={changeHandler}
    //     name="map_api_key"
    //   />
    //   <br />
    //   <button
    //     type="submit"
    //     className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
    //   >
    //     {!mutationLoading && <p>Save</p>}
    //     {mutationLoading && <p>Loading...</p>}
    //     {mutationError && <p>Error :( Please try again</p>}
    //   </button>
    // </form>
  );
}

class AddApp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <CreateApp session={this.props.session} />;
  }
}

export default AddApp;
