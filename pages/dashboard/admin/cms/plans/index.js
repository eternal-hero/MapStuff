import DashboardLayout from "../../../../../components/layouts/dashboard/DashboardLayout";
import { getSession } from "@auth0/nextjs-auth0";
import Head from "next/head";
import useRole from "../../../../../components/hooks/useRole";
import AclPlans from "../../../../../components/dashboard/admin/cms/AclPlans";

export default function Index({ session }) {
  //get role from custom hooks 
  const [role] = useRole(session)
  //add checking if the role includes admin
  if(!role.includes('Admin')) return <p>{JSON.stringify(session)}</p>;  // CD (KO on 20221012): 'comment out' to test this page locally. DON'T FORGET TO 'UNCOMMENT' BEFORE PUSHING YOUR COMMITS
  
  return (
    <div>
      <DashboardLayout session={session}>
        <Head>
          <title>MapStuff.io</title>
          <meta property="og:title" content="MapStuff.io" key="title" />
        </Head>
        <AclPlans />
      </DashboardLayout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context.req, context.res);
  return {
    props: { session: JSON.parse(JSON.stringify(session)) },
  };
}
