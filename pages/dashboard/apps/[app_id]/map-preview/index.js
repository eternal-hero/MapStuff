import { getSession } from "@auth0/nextjs-auth0";
import MapPreview from "../../../../../components/dashboard/apps/MapPreview";
import Head from "next/head";
export default function Index() {
  const [session, loading] = useSession();
  if (typeof window !== "undefined" && loading) return null;

  if (!session) return null

  return (
    <div>
      <Head>
        <title>My page title</title>
        <meta property="og:title" content="My page title" key="title" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <MapPreview session={session} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context.req, context.res);
  return {
    props: { session: JSON.parse(JSON.stringify(session))  },
  };
}
