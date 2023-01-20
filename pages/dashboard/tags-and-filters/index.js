import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import Head from "next/head";

import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import { getSession } from "@auth0/nextjs-auth0";
import Filters from "../../../components/dashboard/tags-and-filters/Filters";
import { useTranslation } from "react-i18next";
function Index({ session }) {
  const { t } = useTranslation();
  if (!session) return null;
  return (
    <div>
      <DashboardLayout session={session}>
        <Head>
          <title>{t("tags-and-filters.title")}</title>
          <meta property="og:title" content="MapStuff.io" key="title" />
        </Head>
        <Filters session={session} />
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
