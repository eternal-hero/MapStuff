import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import Head from "next/head";
import { getSession } from "@auth0/nextjs-auth0";
import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import HelpGuidesAndSupport from "../../../components/dashboard/help-guides-and-support/HelpGuidesAndSupport";
import NeedHelp from "../../../components/dashboard/homepage/NeedHelp";
import { useTranslation } from "react-i18next";

function Index({ session }) {
  const { t } = useTranslation();
  if (!session) return <p>Access Denied</p>;
  return (
    <div>
      <DashboardLayout session={session}>
        <Head>
          <title>{t("help_guides_support.heading")}</title>
          <meta property="og:title" content="MapStuff.io" key="title" />
        </Head>
        <HelpGuidesAndSupport />
        <div className="max-w-3xl mx-auto mb-10 border-t-2 border-gray-500">
          <NeedHelp />
        </div>
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