import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY)
const stripePriceFree = process.env.STRIPE_PRICE_FREE
const stripePriceLite = process.env.STRIPE_PRICE_LITE
const stripePricePlus = process.env.STRIPE_PRICE_PLUS

import AppModal from '../global/AppModal'
import AppButton from '../global/AppButton'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Plans = ({ session, isFromRegistration, setPlan, plan }) => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { t } = useTranslation()
  const confirmationContent = (
    <>
      <p>{t('plans.confirmation_content')}</p>
    </>
  )
  const [modalContent, setModalContent] = useState(confirmationContent)
  const [modalTitle, setModalTitle] = useState(t('plans.upgrade_confirmation'))
  const [modalFooter, setModalFooter] = useState()
  const router = useRouter()

  const handleConfirmationUpgrade = async (id) => {
    const response = await fetch('/api/stripe/change-subscription', {
      method: 'POST',
      body: JSON.stringify({
        priceId: id,
        session: session,
      }),
    })
    const res = await response.json()

    if (res) {
      alert(t('subscription_updated'))
      setIsOpenModal(false)
      setModalContent('')
      setModalTitle('')
      setModalFooter('')
      setPlan(res.updated_subscription.plan)
    }
  }

  const handleCancelUpgrade = () => {
    setIsOpenModal(false)
    setModalContent('')
    setModalTitle('')
    setModalFooter('')
  }

  const handleClickChangeSubscription = async (id) => {
    if (session) {
      {
        /* CD (JD on 20210903):
        If user is coming from free plan going -> lite / plus
        --> proceed to stripe checkout
        Else, where user is coming from lite going -> plus
        --> proceed in changing subscription
      */
      }
      if (session.user.plan.id === process.env.STRIPE_PRICE_FREE) {
        const stripe = await stripePromise
        const response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          body: JSON.stringify({
            priceId: id,
          }),
        })
        const session = await response.json()

        // When the customer clicks on the button, redirect them to Checkout.
        const result = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        })

        if (result.error) {
          // If `redirectToCheckout` fails due to a browser or network
          // error, display the localized error message to your customer
          // using `result.error.message`.
        }
      } else {
        setIsOpenModal(true)
        setModalContent(confirmationContent)
        setModalTitle('Upgrade Confirmation')
        setModalFooter(
          <>
            <button onClick={handleCancelUpgrade}>{t('cancel')}</button>
            <button
              className="mr-10"
              onClick={() => handleConfirmationUpgrade(id)}
            >
              Confirm
            </button>
          </>,
        )
      }
    } else {
      router.push('/register')
    }
  }

  const handleClickStartTrial = async (id) => {
    if (session) {
      const stripe = await stripePromise
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({
          priceId: id,
          id: session?.user?.sub?.replace('auth0|', ''),
        }),
      })
      const session = await response.json()

      // When the customer clicks on the button, redirect them to Checkout.
      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      })

      if (result.error) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      }
    } else {
      router.push('/api/auth/login')
    }
  }

  const handleClickStartFreePlan = () => {
    const { t } = useTranslation()

    /*
      CD (JD on 20210903):
      Validate redirection if and only if there is session detected,
      if none -- prompt a sign in modal.
    */
    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/api/auth/login')
    }
  }

  return (
    <>
      <AppModal
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        content={modalContent}
        title={modalTitle}
        footer={modalFooter}
      />
      <div>
        <div id="Plans" className="bg-gray-500">
          <div className="px-4 pt-12 sm:px-6 lg:px-8 lg:pt-20">
            <div className="text-center">
              <h2 className="text-lg font-semibold leading-6 tracking-wider text-gray-300 uppercase">
                {t('pricing.title')}
              </h2>
              <p className="text-3xl font-extrabold text-white mt- sm:text-4xl lg:text-5xl">
                {t('pricing.subtitle')}
              </p>
              {/*<p className="max-w-4xl mx-auto mt-3 text-xl text-gray-300 sm:mt-5 sm:text-2xl">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit
                numquam eligendi quos odit doloribus molestiae voluptatum.
              </p>*/}
            </div>
          </div>

          <div className="pb-12 mt-16 bg-gray-500 lg:mt-20 lg:pb-20">
            <div className="relative z-0">
              <div className="absolute inset-0 bg-gray-500 h-5/6 lg:h-2/3"></div>
              <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="relative lg:grid lg:grid-cols-7">
                  <div className="max-w-md mx-auto lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3">
                    <div className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg lg:rounded-none lg:rounded-l-lg">
                      <div className="flex flex-col flex-1">
                        <div className="px-6 py-10 bg-white">
                          <div>
                            <h3
                              className="text-2xl font-medium text-center text-gray-900"
                              id="tier-hobby"
                            >
                              {t('pricing.free')}
                            </h3>
                            <div className="flex items-center justify-center mt-4">
                              <span className="flex items-start px-3 text-6xl tracking-tight text-gray-900">
                                <span className="mt-2 mr-2 text-4xl font-medium">
                                  $
                                </span>
                                <span className="font-extrabold">0</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-between flex-1 p-6 border-t-2 border-gray-100 bg-gray-50 sm:p-10 lg:p-6 xl:p-10">
                          <ul className="space-y-4">
                            <li className="flex items-start">
                              <div className="flex-shrink-0">
                                {/* Heroicon name: check */}
                                <svg
                                  className="flex-shrink-0 w-6 h-6 text-green-500"
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <p className="ml-3 text-base font-medium text-gray-500">
                                {t('pricing.1_location')}
                              </p>
                            </li>

                            <li className="flex items-start">
                              <div className="flex-shrink-0">
                                {/* Heroicon name: check */}
                                <svg
                                  className="flex-shrink-0 w-6 h-6 text-green-500"
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <p className="ml-3 text-base font-medium text-gray-500">
                                {t('pricing.search_location')}
                              </p>
                            </li>

                            <li className="flex items-start">
                              <div className="flex-shrink-0">
                                {/* Heroicon name: check */}
                                <svg
                                  className="flex-shrink-0 w-6 h-6 text-green-500"
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <p className="ml-3 text-base font-medium text-gray-500">
                                {t('pricing.automatic_geocoding')}
                              </p>
                            </li>

                            <li className="flex items-start">
                              <div className="flex-shrink-0">
                                {/* Heroicon name: check */}
                                <svg
                                  className="flex-shrink-0 w-6 h-6 text-green-500"
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <p className="ml-3 text-base font-medium text-gray-500">
                                {t('pricing.standard_map')}
                              </p>
                            </li>

                            <li className="flex items-start">
                              <div className="flex-shrink-0">
                                {/* Heroicon name: check */}
                                <svg
                                  className="flex-shrink-0 w-6 h-6 text-green-500"
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <p className="ml-3 text-base font-medium text-gray-500">
                                {t('pricing.customized_color')}
                              </p>
                            </li>

                            <li className="flex items-start">
                              <p>
                                <Link
                                  className="text-base font-medium text-sky-500 hover:underline hover:text-sky-400"
                                  href="/features"
                                >
                                  {t('pricing.see_all_features')}
                                </Link>
                              </p>
                            </li>
                          </ul>
                          <div className="mt-8">
                            {/*
                              CD (JD on 20210903):
                              Created another props isFromRegistration --
                              that flags true if it is coming from Registration Page  and Landing Page
                              to validate the showing of Get Started and Current Plan
                            */}
                            {(isFromRegistration &&
                              plan &&
                              plan.id === process.env.STRIPE_PRICE_FREE) ||
                              plan === null ||
                              (!session && (
                                <div className="rounded-lg shadow-md">
                                  <a
                                    href="#"
                                    onClick={handleClickStartFreePlan}
                                    className="block w-full px-6 py-3 text-base font-medium text-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 text-sky-500 hover:text-sky-500"
                                    aria-describedby="tier-free"
                                  >
                                    {t('pricing.get_started')}
                                  </a>
                                </div>
                              ))}
                            {plan &&
                              plan.id === process.env.STRIPE_PRICE_FREE &&
                              !isFromRegistration && (
                                <div className="rounded-lg shadow-md">
                                  <div
                                    className="block w-full px-6 py-3 text-base font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                    aria-describedby="tier-hobby"
                                  >
                                    {t('pricing.current_plan')}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-lg mx-auto mt-10 lg:mt-0 lg:max-w-none lg:mx-0 lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4">
                    <div className="relative z-10 rounded-lg shadow-xl">
                      <div
                        className="absolute inset-0 border-2 rounded-lg pointer-events-none border-sky-600"
                        aria-hidden="true"
                      ></div>
                      <div className="absolute inset-x-0 top-0 transform translate-y-px">
                        <div className="flex justify-center transform -translate-y-1/2">
                          <span className="inline-flex px-4 py-1 text-sm font-semibold tracking-wider text-white uppercase rounded-full bg-sky-500">
                            {t('pricing.most_popular')}
                          </span>
                        </div>
                      </div>
                      <div className="px-6 pt-12 pb-10 bg-white rounded-t-lg">
                        <div>
                          <h3
                            className="text-3xl font-semibold text-center text-gray-900 sm:-mx-6"
                            id="tier-growth"
                          >
                            {t('pricing.lite')}
                          </h3>
                          <div className="flex items-center justify-center mt-4">
                            <span className="flex items-start px-3 text-6xl tracking-tight text-gray-900 sm:text-6xl">
                              <span className="mt-2 mr-2 text-4xl font-medium">
                                $
                              </span>
                              <span className="font-extrabold">19</span>
                            </span>
                            <span className="text-2xl font-medium text-gray-500">
                              {t('pricing.per_month')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="px-6 pt-10 pb-8 border-t-2 border-gray-100 rounded-b-lg bg-gray-50 sm:px-10 sm:py-10">
                        <ul className="space-y-4">
                          <li className="flex items-start">
                            <div className="flex-shrink-0">
                              {/* Heroicon name: check */}
                              <svg
                                className="flex-shrink-0 w-6 h-6 text-green-500"
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <p className="ml-3 text-base font-medium text-gray-500">
                              {t('pricing.everything_free_plan')}
                            </p>
                          </li>

                          <li className="flex items-start">
                            <div className="flex-shrink-0">
                              {/* Heroicon name: check */}
                              <svg
                                className="flex-shrink-0 w-6 h-6 text-green-500"
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <p className="ml-3 text-base font-medium text-gray-500">
                              {t('pricing.up_to_50_locations')}
                            </p>
                          </li>

                          <li className="flex items-start">
                            <div className="flex-shrink-0">
                              {/* Heroicon name: check */}
                              <svg
                                className="flex-shrink-0 w-6 h-6 text-green-500"
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <p className="ml-3 text-base font-medium text-gray-500">
                              {t('pricing.bulk_uploading_of_locations')}
                            </p>
                          </li>

                          <li className="flex items-start">
                            <div className="flex-shrink-0">
                              {/* Heroicon name: check */}
                              <svg
                                className="flex-shrink-0 w-6 h-6 text-green-500"
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <p className="ml-3 text-base font-medium text-gray-500">
                              {t('pricing.customized_map_theme')}
                            </p>
                          </li>

                          <li className="flex items-start">
                            <div className="flex-shrink-0">
                              {/* Heroicon name: check */}
                              <svg
                                className="flex-shrink-0 w-6 h-6 text-green-500"
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <p className="ml-3 text-base font-medium text-gray-500">
                              {t('pricing.customized_marker')}
                            </p>
                          </li>

                          <li className="flex items-start">
                            <p>
                              <Link
                                className="text-base font-medium text-sky-500 hover:underline hover:text-sky-400"
                                href="/features"
                              >
                                {t('pricing.see_all_features')}
                              </Link>
                            </p>
                          </li>
                        </ul>
                        <div className="mt-10">
                          {(isFromRegistration &&
                            plan &&
                            plan.id === process.env.STRIPE_PRICE_FREE) ||
                            plan === null ||
                            (!session && (
                              <div className="rounded-lg shadow-md">
                                <a
                                  href="#"
                                  onClick={() =>
                                    handleClickStartTrial(stripePriceLite)
                                  }
                                  className="block w-full px-6 py-3 text-base font-medium text-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 text-sky-500 hover:text-sky-500"
                                  aria-describedby="tier-lite"
                                >
                                  {t('pricing.get_started')}
                                </a>
                              </div>
                            ))}
                          {plan && plan === process.env.STRIPE_PRICE_LITE && (
                            <div className="rounded-lg shadow-md">
                              <div
                                className="block w-full px-6 py-3 text-base font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                aria-describedby="tier-hobby"
                              >
                                {t('pricing.current_plan')}
                              </div>
                            </div>
                          )}
                          {plan &&
                            plan.id === process.env.STRIPE_PRICE_FREE &&
                            !isFromRegistration && (
                              <div className="rounded-lg shadow-md">
                                <a
                                  href="#"
                                  onClick={() =>
                                    handleClickChangeSubscription(
                                      process.env.STRIPE_PRICE_LITE,
                                    )
                                  }
                                  className="block w-full px-6 py-4 text-xl font-medium leading-6 text-center text-white rounded-lg bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 hover:text-white"
                                  aria-describedby="tier-growth"
                                >
                                  {t('pricing.upgrade_plan')}
                                </a>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-md mx-auto mt-10 lg:m-0 lg:max-w-none lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3">
                    <div className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg lg:rounded-none lg:rounded-r-lg">
                      <div className="flex flex-col flex-1">
                        <div className="px-6 py-10 bg-white">
                          <div>
                            <h3
                              className="text-2xl font-medium text-center text-gray-900"
                              id="tier-scale"
                            >
                              {t('pricing.plus')}
                            </h3>
                            <div className="flex items-center justify-center mt-4">
                              <span className="flex items-start px-3 text-6xl tracking-tight text-gray-900">
                                <span className="mt-2 mr-2 text-4xl font-medium">
                                  $
                                </span>
                                <span className="font-extrabold">39</span>
                              </span>
                              <span className="text-xl font-medium text-gray-500">
                                {t('pricing.per_month')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-between flex-1 p-6 border-t-2 border-gray-100 bg-gray-50 sm:p-10 lg:p-6 xl:p-10">
                          <ul className="space-y-4">
                            <li className="flex items-start">
                              <div className="flex-shrink-0">
                                {/* Heroicon name: check */}
                                <svg
                                  className="flex-shrink-0 w-6 h-6 text-green-500"
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <p className="ml-3 text-base font-medium text-gray-500">
                                {t('pricing.everything_free_lite_plan')}
                              </p>
                            </li>

                            <li className="flex items-start">
                              <div className="flex-shrink-0">
                                {/* Heroicon name: check */}
                                <svg
                                  className="flex-shrink-0 w-6 h-6 text-green-500"
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <p className="ml-3 text-base font-medium text-gray-500">
                                {t('pricing.unlimited_locations')}
                              </p>
                            </li>

                            <li className="flex items-start">
                              <p>
                                <Link
                                  className="text-base font-medium text-sky-500 hover:underline hover:text-sky-400"
                                  href="/features"
                                >
                                  {t('pricing.see_all_features')}
                                </Link>
                              </p>
                            </li>
                          </ul>
                          <div className="mt-8">
                            {(isFromRegistration &&
                              plan &&
                              plan.id === process.env.STRIPE_PRICE_FREE) ||
                              plan === null ||
                              (!session && (
                                <div className="rounded-lg shadow-md">
                                  <a
                                    href="#"
                                    onClick={() =>
                                      handleClickStartTrial(stripePricePlus)
                                    }
                                    className="block w-full px-6 py-3 text-base font-medium text-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 text-sky-500 hover:text-sky-500"
                                    aria-describedby="tier-plus"
                                  >
                                    {t('pricing.get_started')}
                                  </a>
                                </div>
                              ))}
                            {plan && plan.id === process.env.STRIPE_PRICE_PLUS && (
                              <div className="rounded-lg shadow-md">
                                <div
                                  className="block w-full px-6 py-3 text-base font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                  aria-describedby="tier-hobby"
                                >
                                  {t('pricing.current_plan')}
                                </div>
                              </div>
                            )}
                            {((plan &&
                              plan.id === process.env.STRIPE_PRICE_FREE) ||
                              (plan &&
                                plan.id === process.env.STRIPE_PRICE_LITE)) &&
                              !isFromRegistration && (
                                <div className="rounded-lg shadow-md">
                                  <a
                                    href="#"
                                    onClick={() =>
                                      handleClickChangeSubscription(
                                        process.env.STRIPE_PRICE_PLUS,
                                      )
                                    }
                                    className="block w-full px-6 py-3 text-base font-medium text-center bg-white border border-transparent border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 hover:text-sky-500 text-sky-500"
                                    aria-describedby="tier-growth"
                                  >
                                    {t('pricing.upgrade_plan')}
                                  </a>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Plans
