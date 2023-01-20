import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import Head from "next/head";

import FrontendLayout from "../../components/layouts/FrontendLayout";
import Guides from "../../components/guides/Guides";
import { getSession } from "next-auth/client";
import { useTranslation } from "react-i18next";
export default function Index({ host, session }) {
  const { t } = useTranslation();
  return (
    <div>
      <FrontendLayout>
        <Head>
          <title>{t("guides_resources.page_title")}</title>
          <meta
            name="description"
            content="Learn more about how to use MapStuff in your app. You can also connect with us if there are other ways we can help you."
          />
          <meta
            name="keywords"
            content="MapStuff, customized map, embed map, help guides, resources, how to"
          />

          <meta itemProp="name" content="Guides and Resources | MapStuff.io" />
          <meta
            itemProp="description"
            content="Learn more about how to use MapStuff in your app. You can also connect with us if there are other ways we can help you."
          />
          <meta
            itemProp="image"
            content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg"
            alt="MapStuff.io logo"
          />

          <meta property="og:url" content="https://mapstuff.io/guides" />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="Guides and Resources | MapStuff.io"
          />
          <meta
            property="og:description"
            content="Learn more about how to use MapStuff in your app."
          />
          <meta
            property="og:image"
            content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg"
            alt="MapStuff.io logo"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Guides and Resources | MapStuff.io"
          />
          <meta
            name="twitter:description"
            content="Learn more about how to use MapStuff in your app."
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
        <Guides />
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

