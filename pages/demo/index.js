import Head from "next/head";

import FrontendLayout from "../../components/layouts/FrontendLayout";
import Demo from "../../components/demo/Demo";
import Script from "next/script";
export default function Index({ host, session }) {
  return (
    <div>
      <FrontendLayout>
        <Head>
          <title>Map Demo | MapStuff.io</title>
          <meta name="description" content="See live demo of map. You can customize this more according to your brand." />
          <meta name="keywords" content="MapStuff, customized map, embed map, map demo" />

          <meta itemProp="name" content="Map Demo | MapStuff.io" />
          <meta itemProp="description" content="See live demo of map. You can customize this more according to your brand." />
          <meta itemProp="image" content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg" alt="MapStuff.io logo" />

          <meta property="og:url" content="https://mapstuff.io/demo" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Map Demo | MapStuff.io" />
          <meta property="og:description" content="See live demo of map." />
          <meta property="og:image" content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg" alt="MapStuff.io logo" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Map Demo | MapStuff.io" />
          <meta name="twitter:description" content="See live demo of map." />
          <meta name="twitter:image" content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg" alt="MapStuff.io logo" />
          <link
            href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.2.0/mapbox-gl-geocoder.css"
          />
          <Script src="https://npmcdn.com/@turf/turf/turf.min.js" />
          <Script src="https://api.mapbox.com/mapbox.js/plugins/geojson-extent/v1.0.0/geojson-extent.js" />
          <Script src="https://api.mapbox.com/mapbox.js/plugins/geo-viewport/v0.4.1/geo-viewport.js" />
        </Head>
        <Demo />
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
