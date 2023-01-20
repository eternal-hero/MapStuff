import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import Head from "next/head";

import FrontendLayout from "../../../components/layouts/FrontendLayout";
import HowToAddMapToWordpress from "../../../components/guides/HowToAddMapToWordpress";
import { getSession } from "next-auth/client";
export default function Index({ host, session }) {
 
  return (
    <div>
      <FrontendLayout>
        <Head>
          <title>How to Add a Map to Wordpress | MapStuff.io</title>
          <meta name="description" content="Copy your Mapstuff embed code. In your app's Wordpress dashboard, select or create a page where you want the map to show. Paste the embed code." />
          <meta name="keywords" content="MapStuff, customized map, embed map, integrate map on Wordpress" />

          <meta itemProp="name" content="How to Add a Map to Wordpress | MapStuff.io" />
          <meta itemProp="description" content="Copy your Mapstuff embed code. In your app's Wordpress dashboard, select or create a page where you want the map to show. Paste the embed code." />
          <meta itemProp="image" content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg" alt="MapStuff.io logo" />

          <meta property="og:url" content="https://mapstuff.io/guides/how-to-add-map-to-Wordpress" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content="How to Add a Map to Wordpress | MapStuff.io" />
          <meta property="og:description" content="Step-by-step guide on how to add map on your Wordpress app." />
          <meta property="og:image" content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg" alt="MapStuff.io logo" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="How to Add a Map to Wordpress | MapStuff.io" />
          <meta name="twitter:description" content="Step-by-step guide on how to add map on your Wordpress app." />
          <meta name="twitter:image" content="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg" alt="MapStuff.io logo" />
          <link
            href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css"
            rel="stylesheet"
          />
        </Head>
        <HowToAddMapToWordpress />      
      </FrontendLayout>
    </div>
  );
}



