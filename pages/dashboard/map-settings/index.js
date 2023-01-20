import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import Head from "next/head";

import { getSession } from "@auth0/nextjs-auth0";
import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import MapSettings from "../../../components/dashboard/map-settings/MapSettings";
import { useTranslation } from "react-i18next";
import Script from "next/script";
function Index({ session }) {
  const { t } = useTranslation();
  if (!session) return null;
  return (
    <div>
      <DashboardLayout session={session}>
        <Head>
          <title>{t("map-settings.title")}</title>
          <meta property="og:title" content="MapStuff.io" key="title" />
          <link
            href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.2.0/mapbox-gl-geocoder.css"
          />
          <Script src="https://npmcdn.com/@turf/turf/turf.min.js" />
          <Script src="https://api.mapbox.com/mapbox.js/plugins/geojson-extent/v1.0.0/geojson-extent.js" />
          <Script src="https://api.mapbox.com/mapbox.js/plugins/geo-viewport/v0.4.1/geo-viewport.js" />
        </Head>
        <MapSettings session={session} />
      </DashboardLayout>
    </div>
  );
}

export default Index;

export async function getServerSideProps(context) {
  const session = await getSession(context.req, context.res);
  const res = await fetch(process.env.NEXTAUTH_URL + "/api/stripe/me", {
    method: "POST",
    body: JSON.stringify({
      session: session,
    }),
  });

  if (session) {
    const plan = await res.json();
    session.user.plan = plan.plan;
  }
  return {
    props: { session: JSON.parse(JSON.stringify(session)) },
  };
}
