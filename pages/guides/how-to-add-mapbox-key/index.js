import Head from "next/head";

import FrontendLayout from "../../../components/layouts/FrontendLayout";
import HowToAddMapboxKey from "../../../components/guides/HowToAddMapboxKey";
import { useTranslation } from "react-i18next";
export default function Index() {
  const { t } = useTranslation();
  return (
    <div>
      <FrontendLayout>
        <Head>
          <title>
            {t("help_guides_support.how_to_add_mapbox_key.page_title")}
          </title>
          <meta
            name="description"
            content="Go to Map Settings. Paste your Mapbox key in the API Key field. Save settings."
          />
          <meta
            name="keywords"
            content="MapStuff, customized map, embed map, add Mapbox key"
          />

          <meta
            itemProp="name"
            content="How to Add the Mapbox Key | MapStuff.io"
          />
          <meta
            itemProp="description"
            content="Go to Map Settings. Paste your Mapbox key in the API Key field. Save settings."
          />
          <meta
            itemProp="image"
            content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg"
            alt="MapStuff.io logo"
          />

          <meta
            property="og:url"
            content="https://mapstuff.io/guides/how-to-add-mapbox-key"
          />
          <meta property="og:type" content="article" />
          <meta
            property="og:title"
            content="How to Add the Mapbox Key | MapStuff.io"
          />
          <meta
            property="og:description"
            content="Step-by-step guide on how to add the mapbox key for your map."
          />
          <meta
            property="og:image"
            content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg"
            alt="MapStuff.io logo"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="How to Add the Mapbox Key | MapStuff.io"
          />
          <meta
            name="twitter:description"
            content="Step-by-step guide on how to add the mapbox key for your map."
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
        <HowToAddMapboxKey />
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
