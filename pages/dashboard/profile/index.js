import ProfileForm from "../../../components/profile/ProfileForm";
import { getSession } from "@auth0/nextjs-auth0";
import Head from "next/head";

import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
function Index({ session }) {
  if (!session) return null
  return (
    <div>
      <DashboardLayout session={session}>
        <Head>
          <title>Profile</title>
          <meta property="og:title" content="MapStuff.io" key="title" />
        </Head>
        <ProfileForm session={session} />
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
