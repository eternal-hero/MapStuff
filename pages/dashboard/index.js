// import { Transition } from "@headlessui/react";
import { getSession } from "@auth0/nextjs-auth0";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import AccountDetails from "../../components/dashboard/homepage/AccountDetails";
import AppIntegrations from "../../components/dashboard/homepage/AppIntegrations";
import LetsGetStarted from "../../components/dashboard/homepage/LetsGetStarted";
import MappedLocationsPreview from "../../components/dashboard/homepage/MappedLocationsPreview";
import NeedHelp from "../../components/dashboard/homepage/NeedHelp";
import DashboardLayout from "../../components/layouts/dashboard/DashboardLayout";


function Index({ session }) {
  //Used the useUser hooks from nextAuth0 to validate user login
  const { t } = useTranslation();
  if (!session) return null;

  return (
    <div>
      <DashboardLayout session={session}>
        <Head>
          <title>{t("dashboard.title")}</title>
          <meta property="og:title" content="MapStuff.io" key="title" />
        </Head>
        <AccountDetails session={session} />
        <LetsGetStarted />
        <AppIntegrations />
        <MappedLocationsPreview session={session} />
        <NeedHelp />
      </DashboardLayout>
    </div>
  );
}

export default Index;

export async function getServerSideProps(context) {
  let session = getSession(context.req, context.res)
  const res = await fetch(process.env.NEXTAUTH_URL + "/api/stripe/me", {
    method: "POST",
    body: JSON.stringify({
      session: session,
    }),
  });

  if (session) {
    const plan = await res.json();
    session.user.plan= plan.plan;
  }

  return {
    props: { session: JSON.parse(JSON.stringify(session)), permission: 'Admin' },
  };
}
