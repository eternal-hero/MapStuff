import MapPreview from "../../../../../../components/dashboard/admin/apps/MapPreview";
import Head from "next/head";
import { getSession } from "@auth0/nextjs-auth0";
import useRole from "../../../../../../components/hooks/useRole";
import DashboardLayout from "../../../../../../components/layouts/dashboard/DashboardLayout";
import Script from "next/script";
export default function Index({ session }) {
   //get role from custom hooks 
   const [role] = useRole(session)
   //add checking if the role includes admin
   if(!role.includes('Admin')) return <p>Access Denied</p>;

  return (
    <div>
      <DashboardLayout session={session}>
        <Head>
          <title>My page title</title>
          <meta property="og:title" content="My page title" key="title" />
          <link
            href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css"
            rel="stylesheet"
          />
          <Script src="https://npmcdn.com/@turf/turf/turf.min.js" />
          <Script src="https://api.mapbox.com/mapbox.js/plugins/geojson-extent/v1.0.0/geojson-extent.js" />
          <Script src="https://api.mapbox.com/mapbox.js/plugins/geo-viewport/v0.4.1/geo-viewport.js" />
        </Head>
        <MapPreview session={session} />
      </DashboardLayout>
    </div>
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
