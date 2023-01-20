import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import Head from "next/head";

import FrontendLayout from "../components/layouts/FrontendLayout";
import Hero from "../components/home/Hero";
import Integrations from "../components/home/Integrations";
import Features from "../components/home/Features";
//import DashboardTeaser from "../components/home/DashboardTeaser";
//import Contact from "../components/home/Contact";
import Plans from "../components/global/Plans";
import Divider from "../components/global/Divider";
import { getSession } from "@auth0/nextjs-auth0";
import { useTranslation } from "react-i18next";
export default function Index({ host, session }) {
  const { t } = useTranslation();

  return (
    <div>
      <FrontendLayout>
        <Head>
          <title>{t("map_stuff_heading")}</title>
          <meta
            name="description"
            content="An easy to use and embed store locator map. No coding needed. Works everywhere; Shopify, WordPress, Squarespace, Drupal, JS and other platforms."
          />
          <meta
            name="keywords"
            content="MapStuff, customized map, embed map, no coding, easy to apply"
          />

          <meta itemProp="name" content="Maps for Apps | MapStuff" />
          <meta
            itemProp="description"
            content="An easy to use and embed store locator map. No coding needed. Works everywhere; Shopify, WordPress, Squarespace, Drupal, JS and other platforms."
          />
          <meta
            itemProp="image"
            content="https://cdn.gangnam.club/images/hero/home-hero-phone-map.jpg"
          />

          <meta property="og:url" content="https://mapstuff.io" />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="A Powerful Store Locator Map | Maps for Apps - MapStuff.io"
          />
          <meta
            property="og:description"
            content="An easy to use and embed store locator map. No coding needed. Works everywhere; Shopify, WordPress, Squarespace, Drupal, JS and other platforms."
          />
          <meta
            property="og:image"
            content="https://cdn.gangnam.club/images/hero/home-hero-phone-map.jpg"
            alt="phone map on hero section"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Maps for Apps | MapStuff.io" />
          <meta
            name="twitter:description"
            content="An easy to use and embed store locator map. No coding needed. Works everywhere; Shopify, WordPress, Squarespace, Drupal, JS and other platforms."
          />
          <meta
            name="twitter:image"
            content="https://cdn.gangnam.club/images/hero/home-hero-phone-map.jpg"
            alt="phone map on hero section"
          />

          <link
            href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css"
            rel="stylesheet"
          />
        </Head>
        <Hero host={host} />
        <Features />
        <Divider />
        <Integrations />
        {/* <DashboardTeaser/> */}
        <Plans session={session} isFromRegistration={true} />
        {/* <Contact/> */}
      </FrontendLayout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;

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
      var plan = await res.json();
      session.user.plan = plan.plan;
    }

    return {
      props: { host, session: JSON.parse(JSON.stringify(session)) },
    };
  }
}
