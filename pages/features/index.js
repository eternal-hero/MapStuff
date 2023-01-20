import Head from "next/head";
import { useState, useEffect } from "react";
import FrontendLayout from "../../components/layouts/FrontendLayout";
import FeaturesFull from "../../components/features/FeaturesFull"
import { getSession } from "@auth0/nextjs-auth0";
import { useTranslation } from "react-i18next";

export default function Index({ host, session, resPlan }) {
  const [plan, setPlan] = useState(resPlan);
  const { t } = useTranslation();
  useEffect(() => {
    setPlan(resPlan);
  }, [resPlan]);

  return (
    <div>
      <FrontendLayout>
        <Head>
          <title>{t("features.page_title")}</title>
          <meta
            name="description"
            content="See what you can do with your map without needing to code anything."
          />
          <meta
            name="keywords"
            content="MapStuff, customized map, embed map, map features, no coding needed"
          />

          <meta itemProp="name" content="Map Features | MapStuff.io" />
          <meta
            itemProp="description"
            content="See what you can do with your map without needing to code anything."
          />
          <meta
            itemProp="image"
            content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg"
            alt="MapStuff.io logo"
          />

          <meta property="og:url" content="https://mapstuff.io/features" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Map Features | MapStuff.io" />
          <meta
            property="og:description"
            content="See what you can do with your map without needing to code anything."
          />
          <meta
            property="og:image"
            content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg"
            alt="MapStuff.io logo"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Map Features | MapStuff.io" />
          <meta
            name="twitter:description"
            content="See what you can do with your map without needing to code anything."
          />
          <meta
            name="twitter:image"
            content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg"
            alt="MapStuff.io logo"
          />
          <link
            href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css"
            rel="stylesheet"
          />
        </Head>
        <FeaturesFull session={session} plan={plan} setPlan={setPlan} />
      </FrontendLayout>
    </div>
  );
}

export async function getServerSideProps(context) {
  var plan = null;
  const { req, res } = context;

  if (req) {
    let host = req.headers.host; // will give you localhost:3000

    var session = await getSession(context.req, context.res);

    const res = await fetch(process.env.NEXTAUTH_URL + "/api/stripe/me", {
      method: "POST",
      body: JSON.stringify({
        session: session,
      }),
    });

    if (session) {
      let resPlan = await res.json();
      plan = resPlan.plan;
    }
    return {
      props: { session: JSON.parse(JSON.stringify(session)), resPlan: plan },
    };
  }
}
