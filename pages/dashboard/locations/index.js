import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import Head from "next/head";

import { getSession } from "@auth0/nextjs-auth0";

import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import Locations from "../../../components/dashboard/locations/Locations";
import { useTranslation } from "react-i18next";
function Index({ session }) {
  const { t } = useTranslation();
  if (!session) return null;
  return (
    <div>
      <DashboardLayout session={session}>
        <Head>
          <title>{t("locations.title")}</title>
          <meta property="og:title" content="MapStuff.io" key="title" />
          <link
            href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css"
            rel="stylesheet"
          />
        </Head>
        <Locations session={session} />
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
    props: {  session: JSON.parse(JSON.stringify(session)) },
  };
}
