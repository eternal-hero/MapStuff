import Head from "next/head";

import FrontendLayout from "../../../components/layouts/FrontendLayout";
import HowToIntegrateMapInAnyWebsite from "../../../components/guides/HowToIntegrateMapInAnyWebsite";
import { useTranslation } from "react-i18next";
export default function Index({ host, session }) {
  const { t } = useTranslation();
  return (
    <div>
      <FrontendLayout>
        <Head>
          <title>{t("help_guides_support.how_to_integrate.page_title")}</title>
          <meta
            name="description"
            content="Copy your Mapstuff embed code. In your app's dashboard, select or create a page where you want the map to show. Paste the embed code."
          />
          <meta
            name="keywords"
            content="MapStuff, customized map, embed map, integrate map on your app"
          />

          <meta
            itemProp="name"
            content="How to Integrate a Map in any Website | MapStuff.io"
          />
          <meta
            itemProp="description"
            content="Copy your Mapstuff embed code. In your app's dashboard, select or create a page where you want the map to show. Paste the embed code."
          />
          <meta
            itemProp="image"
            content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg"
            alt="MapStuff.io logo"
          />

          <meta
            property="og:url"
            content="https://mapstuff.io/guides/how-to-integrate-map-in-any-website"
          />
          <meta property="og:type" content="article" />
          <meta
            property="og:title"
            content="How to Integrate a Map in any Website | MapStuff.io"
          />
          <meta
            property="og:description"
            content="Step-by-step guide on how to add map on your app in any platform."
          />
          <meta
            property="og:image"
            content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg"
            alt="MapStuff.io logo"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="How to Integrate a Map in any Website | MapStuff.io"
          />
          <meta
            name="twitter:description"
            content="Step-by-step guide on how to add map on your app in any platform."
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
        <HowToIntegrateMapInAnyWebsite />
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