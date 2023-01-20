import { useSession, getSession } from "next-auth/client";
import AddLocation from "../../../../../../components/dashboard/apps/AddLocation";
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
      <AddLocation session={session} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
