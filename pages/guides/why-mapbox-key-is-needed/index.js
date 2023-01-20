import Head from "next/head";

import FrontendLayout from "../../../components/layouts/FrontendLayout";
import WhyIsMapboxKeyNeeded from "../../../components/guides/WhyIsMapboxKeyNeeded";
import { useTranslation } from "react-i18next";
export default function Index({ host, session }) {
  const { t } = useTranslation();
  return (
    <div>
      <FrontendLayout>
        <Head>
          <title>
            {t("help_guides_support.why_do_you_need_mapbox_key.page_title")}
          </title>
          <meta
            name="description"
            content="Mapstuff requires an access token to access Mapbox’s API which enables you to use their comprehensive map data and other related features."
          />
          <meta
            name="keywords"
            content="MapStuff, customized map, embed map, why Mapbox key"
          />

          <meta
            itemProp="name"
            content="Why Do You Need a Mapbox Key? | MapStuff.io"
          />
          <meta
            itemProp="description"
            content="Mapstuff requires an access token to access Mapbox’s API which enables you to use their comprehensive map data and other related features."
          />
          <meta
            itemProp="image"
            content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg"
            alt="MapStuff.io logo"
          />

          <meta
            property="og:url"
            content="https://mapstuff.io/guides/why-mapbox-key-is-needed"
          />
          <meta property="og:type" content="article" />
          <meta
            property="og:title"
            content="Why Do You Need a Mapbox Key? | MapStuff.io"
          />
          <meta
            property="og:description"
            content="Learn why you need a Mapbox key to start mapping."
          />
          <meta
            property="og:image"
            content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg"
            alt="MapStuff.io logo"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Why Do You Need a Mapbox Key? | MapStuff.io"
          />
          <meta
            name="twitter:description"
            content="Learn why you need a Mapbox key to start mapping."
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
        <WhyIsMapboxKeyNeeded />
      </FrontendLayout>
    </div>
  );
}
export async function getServerSideProps(context) {
  const { req } = context;

  if (req) {
    let host = req.headers.host; // will give you localhost:3000

    return {
      props: { host },
    };
  }
}

