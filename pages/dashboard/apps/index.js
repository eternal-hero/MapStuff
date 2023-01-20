import { getSession } from "next-auth/client";
import Head from "next/head";
import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import AppsList from "../../../components/dashboard/apps/Apps";
export default function Index({ session }) {
  if (!session) return null

  return (
    <DashboardLayout session={session}>
      <Head>
        <title>App Details</title>
        <meta property="og:title" content="MapStuff.io" key="title" />
      </Head>
      <AppsList session={session} />
    </DashboardLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
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
    props: { session },
  };
}
