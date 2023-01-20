import React, { Component } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { LOCATION_QUERY } from "../../../../graphql/dashboard/apps/location.query";

function FetchLocation() {
  const router = useRouter();
  const { app_id, location_id } = router.query;

  const { loading, error, data } = useQuery(LOCATION_QUERY, {
    variables: { input: { app_url: app_id, _id: location_id } },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return data.location ? (
    <dl>
      <dt>
        <b>App url</b>
      </dt>
      <dd>- {data.location.app_url}</dd>
      <dt>
        <b>Name</b>
      </dt>
      <dd>- {data.location.name}</dd>
      <dt>
        <b>Status</b>
      </dt>
      <dd>- {data.location.status}</dd>
      <dt>
        <b>Address</b>
      </dt>
      <dd>- {data.location.properties.address}</dd>
      <dt>
        <b>City</b>
      </dt>
      <dd>- {data.location.properties.city}</dd>
      <dt>
        <b>State</b>
      </dt>
      <dd>- {data.location.properties.state}</dd>
      <dt>
        <b>Country</b>
      </dt>
      <dd>- {data.location.properties.country}</dd>
      <dt>
        <b>Email</b>
      </dt>
      <dd>- {data.location.properties.email}</dd>
      <dt>
        <b>Phone</b>
      </dt>
      <dd>- {data.location.properties.phone}</dd>
      <dt>
        <b>Postal Code</b>
      </dt>
      <dd>- {data.location.properties.postalCode}</dd>
      <dt>
        <b>Url</b>
      </dt>
      <dd>- {data.location.properties.url}</dd>
    </dl>
  ) : (
    "no data found"
  );
}

class ViewLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <FetchLocation />;
  }
}

export default ViewLocation;
