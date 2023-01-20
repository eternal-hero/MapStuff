import React from 'react'
import { useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import TheDashboardHeader from './TheDashboardHeader'
/* CD (EV on 20210212):  import Link from next-link */
import Link from 'next/link'
/* CD (EV on 20210212):  import useRouter from next-router */
import useRole from '../../hooks/useRole'
import { useRouter } from 'next/router'
import LogoDashboard from '../../global/logos/LogoDashboard'
import { useTranslation } from 'react-i18next'
import Script from 'next/script'

const DashboardLayout = ({ children, session, headerPlanLoading = false }) => {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [role] = useRole(session)
  /* CD (EV on 20210212):  declare router*/
  const router = useRouter()
  /* CD (EV on 20210212):  NavBar item if class if active*/
  const navActiveClassName =
    'flex items-center px-2 py-2 text-base font-medium text-white rounded-md hover:text-white bg-sky-600 group'
  /* CD (EV on 20210212):  NavBar item if class if inactive*/
  const navInActiveClassName =
    'flex items-center px-2 py-2 text-base font-medium text-gray-100 rounded-md hover:bg-sky-500 hover:text-white group active:text-white active:bg-sky-600'

  const signOutHandler = () => {
    router.push('/api/auth/logout')
  }
  // Allow to use the `esc` key
  useEffect(() => {
    function handleEscape(event) {
      if (!mobileOpen) return

      if (event.key === 'Escape') {
        setMobileOpen(false)
      }
    }

    document.addEventListener('keyup', handleEscape)
    return () => document.removeEventListener('keyup', handleEscape)
  }, [mobileOpen])

  const viewProfile = () => {
    router.push('/dashboard/profile')
  }
  return (
    <div>
      {/* Start GTM code */}
      <Script dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','{process.env.GTM}');`}} />

      <noscript dangerouslySetInnerHTML={{
        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.GTM}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>`}}></noscript>
      {/* End GTM code */}

      <div className="flex h-full h-screen overflow-hidden bg-gray-100">
        {/* Off-canvas menu for mobile, show/hide based on off-canvas menu state. */}
        {/* Off-canvas menu for mobile */}
        <Transition
          show={mobileOpen}
          className="fixed inset-0 z-40 flex md:hidden"
        >
          {/* Off-canvas menu overlay, show/hide based on off-canvas menu state. */}
          <Transition.Child
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0"
          >
            {(ref) => (
              <div ref={ref}>
                <div
                  onClick={() => setMobileOpen(false)}
                  className="absolute inset-0 bg-gray-600 opacity-75"
                />
              </div>
            )}
          </Transition.Child>
          <Transition.Child
            className="relative flex flex-col flex-1 w-full h-full max-w-xs bg-gray-700"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="absolute top-0 right-0 pt-2 -mr-12">
              <Transition.Child
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-label="Close sidebar"
                as="button"
                onClick={() => setMobileOpen(false)}
              >
                <span className="sr-only">{t('close_sidebar')}</span>
                {/* Heroicon name: x */}
                <svg
                  className="w-6 h-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Transition.Child>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 w-full px-4 cursor-pointer">
                <div className="mx-auto">
                  <LogoDashboard />
                </div>
              </div>
              <nav className="px-2 mt-10 space-y-1">
                {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-sky-600 hover:text-white" */}
                <Link href={'/dashboard'}>
                  <span
                    className={
                      router.pathname == '/dashboard'
                        ? navActiveClassName
                        : navInActiveClassName
                    }
                  >
                    {/* Current: "text-gray-300", Default: "text-gray-200 group-hover:text-gray-200" */}
                    {/* Heroicon name: home */}
                    <svg
                      className="w-6 h-6 mr-3 text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    {t('dashboard.title')}
                  </span>
                </Link>
                {role.includes('Admin') ? (
                  <Link href="/dashboard/admin/apps">
                    <span
                      className={
                        router.pathname == '/dashboard/admin/apps'
                          ? navActiveClassName
                          : navInActiveClassName
                      }
                    >
                      {/* Heroicon name: Desktop */}
                      <svg
                        className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                      {t('map_apps')}
                    </span>
                  </Link>
                ) : (
                  ''
                )}

                <Link href="/dashboard/locations">
                  <span
                    className={
                      router.pathname == '/dashboard/locations'
                        ? navActiveClassName
                        : navInActiveClassName
                    }
                  >
                    {/* Heroicon name: location-marker */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {t('locations.title')}
                  </span>
                </Link>
                <Link href="/dashboard/tags-and-filters">
                  <span
                    className={
                      router.pathname == '/dashboard/tags-and-filters'
                        ? navActiveClassName
                        : navInActiveClassName
                    }
                  >
                    {/* Heroicon name: color-swatch */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                    {t('tags-and-filters.title')}
                  </span>
                </Link>
                <Link href="/dashboard/map-settings">
                  <span
                    className={
                      router.pathname == '/dashboard/map-settings'
                        ? navActiveClassName
                        : navInActiveClassName
                    }
                  >
                    {/* Heroicon name: puzzle */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                      />
                    </svg>
                    {t('map-settings.title')}
                  </span>
                </Link>
                <Link href="/dashboard/map-embed-code">
                  <span
                    className={
                      router.pathname == '/dashboard/map-embed-code'
                        ? navActiveClassName
                        : navInActiveClassName
                    }
                  >
                    {/* Heroicon name: map */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    {t('map-embedded-code.title')}
                  </span>
                </Link>
                <Link href="/dashboard/plans">
                  <span
                    className={
                      router.pathname == '/dashboard/plans'
                        ? navActiveClassName
                        : navInActiveClassName
                    }
                  >
                    {/* Heroicon name: credit-card */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    {t('plans.title')}
                  </span>
                </Link>
                {role.includes('Admin') ? (
                  <Link href="/dashboard/admin/cms/plans">
                    <span
                      className={
                        router.pathname == '/dashboard/admin/cms/plans'
                          ? navActiveClassName
                          : navInActiveClassName
                      }
                    >
                      {/* Heroicon name: Desktop */}
                      <svg
                        className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                      {t('plan_feature_settings')}
                    </span>
                  </Link>
                ) : (
                  ''
                )}
                <Link href="/dashboard/help-guides-and-support">
                  <span
                    className={
                      router.pathname == '/dashboard/help-guides-and-support'
                        ? navActiveClassName
                        : navInActiveClassName
                    }
                  >
                    {/* Heroicon name: support */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    {t('help_guides_support.title')}
                  </span>
                </Link>
              </nav>
            </div>
            <div className="flex flex-shrink-0 p-4 bg-gray-600">
              <a href="/" className="flex-shrink-0 block group">
                <div className="flex items-center">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline-block w-10 h-10 rounded-full text-sky-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {session && session.user.email}
                    </p>
                    <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                      <button onClick={viewProfile}> {t('view_profile')}</button>{' '}
                      <button onClick={signOutHandler}>{t('sign_out')}</button>
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </Transition.Child>

          <div className="flex-shrink-0 w-14">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Transition>
        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex flex-col flex-1 h-0 bg-gray-700">
              <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 w-full px-4 cursor-pointer">
                  <div className="mx-auto">
                    <LogoDashboard />
                  </div>
                </div>
                <nav className="flex-1 px-2 mt-10 space-y-1 bg-gray-700">
                  {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-sky-600 hover:text-white" */}
                  <Link href={'/dashboard'}>
                    <span
                      className={
                        router.pathname == '/dashboard'
                          ? navActiveClassName
                          : navInActiveClassName
                      }
                    >
                      {/* Current: "text-gray-300", Default: "text-gray-200 group-hover:text-gray-200" */}
                      {/* Heroicon name: home */}
                      <svg
                        className="w-6 h-6 mr-3 text-gray-200"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      {t('dashboard.title')}
                    </span>
                  </Link>
                  {role.includes('Admin') ? (
                    <Link href="/dashboard/admin/apps">
                      <span
                        className={
                          router.pathname == '/dashboard/admin/apps'
                            ? navActiveClassName
                            : navInActiveClassName
                        }
                      >
                        {/* Heroicon name: Desktop */}
                        <svg
                          className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          ></path>
                        </svg>
                        {t('map_apps')}
                      </span>
                    </Link>
                  ) : (
                    ''
                  )}
                  <Link href="/dashboard/locations">
                    <span
                      className={
                        router.pathname == '/dashboard/locations'
                          ? navActiveClassName
                          : navInActiveClassName
                      }
                    >
                      {/* Heroicon name: location-marker */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {t('locations.title')}
                    </span>
                  </Link>
                  <Link href="/dashboard/tags-and-filters">
                    <span
                      className={
                        router.pathname == '/dashboard/tags-and-filters'
                          ? navActiveClassName
                          : navInActiveClassName
                      }
                    >
                      {/* Heroicon name: color-swatch */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                      {t('tags-and-filters.title')}
                    </span>
                  </Link>
                  <Link href="/dashboard/map-settings">
                    <span
                      className={
                        router.pathname == '/dashboard/map-settings'
                          ? navActiveClassName
                          : navInActiveClassName
                      }
                    >
                      {/* Heroicon name: puzzle */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                        />
                      </svg>
                      {t('map-settings.title')}
                    </span>
                  </Link>
                  <Link href="/dashboard/map-embed-code">
                    <span
                      className={
                        router.pathname == '/dashboard/map-embed-code'
                          ? navActiveClassName
                          : navInActiveClassName
                      }
                    >
                      {/* Heroicon name: map */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      {t('map-embedded-code.title')}
                    </span>
                  </Link>
                  <Link href="/dashboard/plans">
                    <span
                      className={
                        router.pathname == '/dashboard/plans'
                          ? navActiveClassName
                          : navInActiveClassName
                      }
                    >
                      {/* Heroicon name: credit-card */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      {t('plans.title')}
                    </span>
                  </Link>
                  {role.includes('Admin') ? (
                    <Link href="/dashboard/admin/cms/plans">
                      <span
                        className={
                          router.pathname == '/dashboard/admin/cms/plans'
                            ? navActiveClassName
                            : navInActiveClassName
                        }
                      >
                        {/* Heroicon name: Desktop */}
                        <svg
                          className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          ></path>
                        </svg>
                        {t('plan_feature_settings')}
                      </span>
                    </Link>
                  ) : (
                    ''
                  )}
                  <Link href="/dashboard/help-guides-and-support">
                    <span
                      className={
                        router.pathname == '/dashboard/help-guides-and-support'
                          ? navActiveClassName
                          : navInActiveClassName
                      }
                    >
                      {/* Heroicon name: support */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 mr-3 text-gray-200 group-hover:text-gray-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      {t('help_guides_support.title')}
                    </span>
                  </Link>
                </nav>
              </div>
              <div className="flex flex-shrink-0 p-4 bg-gray-600">
                <a className="flex-shrink-0 block w-full group">
                  <div className="flex items-center">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline-block w-10 h-10 rounded-full text-sky-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1"
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">
                        {session && session.user.email}
                      </p>
                      <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                        <button onClick={viewProfile}>{t('view_profile')}</button>{' '}
                        <button onClick={signOutHandler}>{t('sign_out')}</button>
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <div className="pt-1 pl-1 md:hidden sm:pl-3 sm:pt-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
            >
              <span className="sr-only">Open sidebar</span>
              {/* Heroicon name: menu */}
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto">
            <TheDashboardHeader
              session={session}
              headerPlanLoading={headerPlanLoading}
            />
            <div className="my-8">
              <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
                <main>{children}</main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
