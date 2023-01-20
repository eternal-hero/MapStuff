import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import Head from "next/head";

import FrontendLayout from "../../../components/layouts/FrontendLayout";
import HowToCustomizeMap from "../../../components/guides/HowToCustomizeMap";
import { useTranslation } from "react-i18next";
export default function Index({ host, session }) {
  const { t } = useTranslation();

  return (
    <div>
      <FrontendLayout>
        <Head>
          <title>
            {t("help_guides_support.how_to_customize_map.page_title")}
          </title>
          <meta
            name="description"
            content="Go to the map settings page. Edit the fields according to your preferences. Click Preview Map to apply the new settings and save."
          />
          <meta
            name="keywords"
            content="MapStuff, customized map, embed map, add Mapbox key"
          />

          <meta
            itemProp="name"
            content="How to Customize Your Map | MapStuff.io"
          />
          <meta
            itemProp="description"
            content="Go to the map settings page. Edit the fields according to your preferences. Click Preview Map to apply the new settings and save."
          />
          <meta
            itemProp="image"
            content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg"
            alt="MapStuff.io logo"
          />

          <meta
            property="og:url"
            content="https://mapstuff.io/guides/how-to-customize-map"
          />
          <meta property="og:type" content="article" />
          <meta
            property="og:title"
            content="How to Customize Your Map | MapStuff.io"
          />
          <meta
            property="og:description"
            content="Step-by-step guide on how to tailor your map for your brand."
          />
          <meta
            property="og:image"
            content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg"
            alt="MapStuff.io logo"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="How to Customize Your Map | MapStuff.io"
          />
          <meta
            name="twitter:description"
            content="Step-by-step guide on how to tailor your map for your brand."
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
        <HowToCustomizeMap />
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