import Head from "next/head";

import FrontendLayout from "../../../components/layouts/FrontendLayout";
import HowToPreviewMap from "../../../components/guides/HowToPreviewMap";
import { useTranslation } from "react-i18next";
export default function Index({ host, session }) {
  const { t } = useTranslation();
  return (
    <div>
      <FrontendLayout>
        <Head>
          <title>
            {t("help_guides_support.how_to_preview_your_map.page_title")}
          </title>
          <meta
            name="description"
            content="Take note to add your Mapbox key first in your map settings. In your dashboard, go to Map Embed Code Code page. Preview your map."
          />
          <meta
            name="keywords"
            content="MapStuff, customized map, embed map, preview map"
          />

          <meta
            itemProp="name"
            content="How to Preview Your Map | MapStuff.io"
          />
          <meta
            itemProp="description"
            content="Take note to add your Mapbox key first in your map settings. In your dashboard, go to Map Embed Code Code page. Preview your map."
          />
          <meta
            itemProp="image"
            content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg"
            alt="MapStuff.io logo"
          />

          <meta
            property="og:url"
            content="https://mapstuff.io/guides/how-to-preview-map"
          />
          <meta property="og:type" content="article" />
          <meta
            property="og:title"
            content="How to Preview Your Map | MapStuff.io"
          />
          <meta
            property="og:description"
            content="Step-by-step guide on how to see a preview of your map before going live."
          />
          <meta
            property="og:image"
            content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg"
            alt="MapStuff.io logo"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="How to Preview Your Map | MapStuff.io"
          />
          <meta
            name="twitter:description"
            content="Step-by-step guide on how to see a preview of your map before going live."
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
        <HowToPreviewMap />
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


