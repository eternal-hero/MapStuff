import React, { Component, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LOCATIONS_QUERY_CHECK_API_KEY } from "../../../graphql/dashboard/admin/apps/location.query";
import { LOCATION_DELETE_ONE_MUTATION } from "../../../graphql/dashboard/admin/apps/location.mutation";

import AppSlideOverPanel from "../../../components/global/AppSlideOverPanel";

import EditLocation from "./EditLocation";
import ViewLocation from "./ViewLocation";

import { useQuery, useMutation } from "@apollo/client";
import Link from "next/link";
function FectchLocations() {
  const router = useRouter();
  const { app_id } = router.query;

  const [isOpen, setIsOpen] = useState(false);
  const [slideTitle, setSlideTitle] = useState("");
  const [slideContent, setSlideContent] = useState("");

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

  const EditForm = ({ id }) => {
    return <EditLocation location_id={id} />;
  };

  const ViewForm = ({ id }) => {
    return <ViewLocation location_id={id} />;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div>
      <AppSlideOverPanel
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={slideTitle}
        content={slideContent}
      />
      <Link
        className="text-sky-600 hover:text-sky-900 hover:cursor-pointer"
        href={"/dashboard/apps/" + app_id + "/locations/add"}
      >
        ADD
      </Link>
      {!loading && data.app && <p>MAPBOX KEY ADDED</p>}
      {!loading && !data.app && <p>NO MAPBOX KEY</p>}
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Address</th>
            <th>Action</th>
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
                  <a
                    href="#"
                    className="text-sky-600 hover:text-sky-900 hover:cursor-pointer"
                    onClick={() => {
                      setIsOpen(!isOpen);
                      setSlideTitle("View location details");
                      setSlideContent(<ViewForm id={_id} />);
                    }}
                  >
                    View
                  </a>
                  &nbsp;&nbsp;
                  <a
                    href="#"
                    className="text-sky-600 hover:text-sky-900 hover:cursor-pointer"
                    onClick={() => {
                      setIsOpen(!isOpen);
                      setSlideTitle("Edit location details");
                      setSlideContent(<EditForm id={_id} />);
                    }}
                  >
                    Edit
                  </a>
                  &nbsp;&nbsp;
                  <button onClick={(e) => deleteRow(_id, e)}>Delete Row</button>
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
}

class Locations extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <FectchLocations />;
  }
}

export default Locations;
