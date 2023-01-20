import Script from "next/script";
import { useTranslation } from "react-i18next";

export default function Index({ host, session }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <div>
        <div id="Guides" className="relative py-8 bg-white sm:py-12 lg:py-16">
          <div className="text-center">
            {/*<h2 className="text-lg font-semibold leading-6 tracking-wider text-gray-300 uppercase">
              Pricing
            </h2>*/}
            <h1 className="block text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {t("locations.title")}
            </h1>
            {/*<p className="max-w-4xl mx-auto mt-3 text-xl text-gray-300 sm:mt-5 sm:text-2xl">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit
              numquam eligendi quos odit doloribus molestiae voluptatum.
            </p>*/}
          </div>
        </div>
      </div>
      {/*CD (CT on 20220220): Update the embed code below with the demo account. "data-app" will have a new value for new apps. */}
      <div>
        <div className="px-4 mx-auto mb-16 md:px-12">
          <div id="map-mapstuff"></div>
          <Script src="https://cdn.gangnam.club/widget/plugins.js" />
          <Script
            src="https://cdn.gangnam.club/widget/mapbox2.js"
            data-id="dev-store-locator-react"
            data-app="62be1f19ebb532e9b5d533a5"
            data-key="9KaO8fRVs87wsFKxddLaTqSdODU2JmaBO5YgDkL6e6OEaGAI9Auo5tIuvT8Z3vSG"
          />
        </div>
      </div>
    </div>
  );
}