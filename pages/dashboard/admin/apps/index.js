import { getSession } from "@auth0/nextjs-auth0";
import Head from "next/head";
import DashboardLayout from "../../../../components/layouts/dashboard/DashboardLayout";
import useRole from "../../../../components/hooks/useRole";
import AppsList from "../../../../components/dashboard/admin/apps/Apps";
export default function Index({ session }) {
 //get role from custom hooks 
 const [role] = useRole(session)
 //add checking if the role includes admin
 //if(!role.includes('Admin')) return <p>Access Denied</p>;  // CD (KO on 20221012): 'comment out' to test this page locally. DON'T FORGET TO 'UNCOMMENT' BEFORE PUSHING YOUR COMMITS


  return (
    <DashboardLayout session={session}>
      <Head>
        <title>Admin Dashboard - Apps</title>
        <meta property="og:title" content="MapStuff.io" key="title" />
      </Head>
      <AppsList session={session} /> 
    </DashboardLayout>
  );
}

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
