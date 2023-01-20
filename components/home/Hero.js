import React from "react";
import Map from "./Map";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const Hero = ({ children, host }) => {
  const { t } = useTranslation();
  return (
    <>
      <div>
        <div className="relative bg-gray-50">
          <main className="lg:relative">
            <div className="w-full pt-16 pb-20 mx-auto text-center max-w-7xl lg:py-10 lg:text-left">
              <div className="px-4 lg:w-1/2 sm:px-8 xl:pr-16">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                  <span className="block xl:inline">
                    {t("main_page.store_locator_that")}{" "}
                  </span>
                  <span className="block text-sky-600 xl:inline">
                    {t("main_page.maps_business_online")}{" "}
                  </span>
                </h1>
                <p className="max-w-md mx-auto mt-3 text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                  {t("main_page.easy_to_install_manage")}
                </p>
                <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/#Plans">
                      <span className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white border border-transparent rounded-md bg-sky-500 hover:bg-sky-500 md:py-4 md:text-lg md:px-10">
                        {t("pricing.get_started")}
                      </span>
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link href="/demo">
                      <span className="flex items-center justify-center w-full px-8 py-3 text-base font-medium bg-white border border-transparent rounded-md text-sky-600 hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                        {t("main_page.live_demo")}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full h-64 sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full">
              <img
                className="absolute inset-0 object-cover w-full h-full"
                src="https://cdn.gangnam.club/images/hero/home-hero-phone-map.jpg"
                alt=""
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Hero;
