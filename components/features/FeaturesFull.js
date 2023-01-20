import IconCheckSolid from '../global/IconCheckSolid'
import IconMinusSolid from '../global/IconMinusSolid'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import useRole from '../hooks/useRole'

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY)
const stripePriceFree = process.env.STRIPE_PRICE_FREE
const stripePriceLite = process.env.STRIPE_PRICE_LITE
const stripePricePlus = process.env.STRIPE_PRICE_PLUS

import AppModal from '../global/AppModal'
import AppButton from '../global/AppButton'
import AppSticky from '../global/AppSticky'

import RegistrationForm from '../../components/register/RegistrationForm'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

const USER_PLANS = {
  FREE: 'FREE',
  LITE: 'LITE',
  PLUS: 'PLUS',
}

const USER_ROLE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
}

const FeaturesFull = ({ session, setPlan, plan }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [role] = useRole(session)

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalContent, setModalContent] = useState(
    <>
      <p>{t('plans.confirmation_content')}</p>
    </>,
  )
  const [modalTitle, setModalTitle] = useState(t('plans.upgrade_confirmation'))
  const [modalFooter, setModalFooter] = useState()

  const getCurrentUserPlan = () => {
    if (!plan || !plan.id) return null
    if (plan.id === process.env.STRIPE_PRICE_FREE) return USER_PLANS.FREE
    if (plan.id === process.env.STRIPE_PRICE_LITE) return USER_PLANS.LITE
    if (plan.id === process.env.STRIPE_PRICE_PLUS) return USER_PLANS.PLUS
  }

  const getUserRole = () => {
    if (role.length === 0) return null
    if (role.includes('Admin')) return USER_ROLE.ADMIN
    if (role.includes('User')) return USER_ROLE.USER
  }

  console.log('getCurrentUserPlan', getCurrentUserPlan())
  console.log('getUserRole', getUserRole())

  const handleClickChangeSubscription = async (id) => {
    if (session) {
      const stripe = await stripePromise
      const response = await fetch('/api/stripe/change-subscription', {
        method: 'POST',
        body: JSON.stringify({
          priceId: id,
          session: session,
        }),
      })
      const res = await response.json()
      setPlan(res.updated_subscription.plan)
      if (res) {
        alert('subscription updated')
        setIsOpenModal(false)
      }
    } else {
      router.push('/api/auth/login')
    }
  }

  const handleClickStartTrial = async (id) => {
    if (session) {
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
      router.push('/api/auth/login')
    }
  }

  const FreePlanActions = ({ isMobileView }) => {
    return (
      getUserRole() !== USER_ROLE.ADMIN && (
        <div
          className={`${
            isMobileView ? 'px-4 pt-5 border-t border-gray-200 ' : ''
          }space-y-2`}
        >
          {getCurrentUserPlan() && getCurrentUserPlan() !== USER_PLANS.FREE && (
            <a
              className="text-sm font-medium text-blue-600 hover:underline hover:text-blue-500 text-left"
              href="mailto:support@MapStuff.io"
            >
              {t('pricing.please_contact_downgrade_your_plan')}
            </a>
          )}

          {!getCurrentUserPlan() && (
            <AppButton
              label={t('pricing.get_started')}
              className="primary-full"
              handleClick={() => handleClickStartTrial(stripePriceFree)}
            />
          )}

          {getCurrentUserPlan() === USER_PLANS.FREE && (
            <button className="opacity-70 cursor-not-allowed  inline-flex w-full justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm whitespace-nowrap outline-none">
              Current Plan
            </button>
          )}
        </div>
      )
    )
  }
  const LitePlanActions = ({ isMobileView }) => {
    return (
      getUserRole() !== USER_ROLE.ADMIN && (
        <div
          className={`${
            isMobileView ? 'px-4 pt-5 border-t border-gray-200 ' : ''
          }space-y-2`}
        >
          {getCurrentUserPlan() && getCurrentUserPlan() === USER_PLANS.PLUS && (
            <a
              className="text-sm font-medium text-blue-600 hover:underline hover:text-blue-500 text-left"
              href="mailto:support@MapStuff.io"
            >
              {t('pricing.please_contact_downgrade_your_plan')}
            </a>
          )}

          {!getCurrentUserPlan() && (
            <AppButton
              label={t('pricing.get_started')}
              className="primary-full"
              handleClick={() => handleClickStartTrial(stripePriceLite)}
            />
          )}

          {getCurrentUserPlan() === USER_PLANS.LITE && (
            <button className="opacity-70 cursor-not-allowed  inline-flex w-full justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm whitespace-nowrap outline-none">
              Current Plan
            </button>
          )}

          {getCurrentUserPlan() === USER_PLANS.FREE && (
            <AppButton
              label="UPGRADE PLAN"
              className="primary-full"
              handleClick={() => {
                if (
                  plan === null ||
                  plan.id === process.env.STRIPE_PRICE_FREE
                ) {
                  handleClickStartTrial(process.env.STRIPE_PRICE_LITE)
                } else {
                  setIsOpenModal(true)
                  setModalFooter(
                    <>
                      <AppButton
                        label="Upgrade Plan"
                        className="primary"
                        handleClick={() =>
                          handleClickChangeSubscription(
                            process.env.STRIPE_PRICE_LITE,
                          )
                        }
                      />
                      &nbsp; &nbsp;
                      <AppButton
                        label="Cancel"
                        className="tertiary"
                        handleClick={() => setIsOpenModal(false)}
                      />
                    </>,
                  )
                }
              }}
            />
          )}
        </div>
      )
    )
  }
  const PlusPlanActions = ({ isMobileView }) => {
    return (
      getUserRole() !== USER_ROLE.ADMIN && (
        <div
          className={`${
            isMobileView ? 'px-4 pt-5 border-t border-gray-200 ' : ''
          }space-y-2`}
        >
          {!getCurrentUserPlan() && (
            <AppButton
              label={t('pricing.get_started')}
              className="primary-full"
              handleClick={() => handleClickStartTrial(stripePricePlus)}
            />
          )}

          {getCurrentUserPlan() === USER_PLANS.PLUS && (
            <button className="opacity-70 cursor-not-allowed  inline-flex w-full justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm whitespace-nowrap outline-none">
              Current Plan
            </button>
          )}

          {(getCurrentUserPlan() === USER_PLANS.FREE ||
            getCurrentUserPlan() === USER_PLANS.LITE) && (
            <AppButton
              label="UPGRADE PLAN"
              className="primary-full"
              handleClick={() => {
                if (
                  plan === null ||
                  plan.id === process.env.STRIPE_PRICE_FREE
                ) {
                  handleClickStartTrial(stripePricePlus)
                } else {
                  setIsOpenModal(true)
                  setModalFooter(
                    <>
                      <AppButton
                        label="Upgrade Plan"
                        className="primary"
                        handleClick={() =>
                          handleClickChangeSubscription(
                            process.env.STRIPE_PRICE_PLUS,
                          )
                        }
                      />
                      &nbsp; &nbsp;
                      <AppButton
                        label="Cancel"
                        className="tertiary"
                        handleClick={() => setIsOpenModal(false)}
                      />
                    </>,
                  )
                }
              }}
            />
          )}
        </div>
      )
    )
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
        <div className="relative py-8 bg-white sm:py-12 lg:py-16">
          <div className="text-center">
            <h1 className="block text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {t('features_full.mapstuff_pricing')}
            </h1>
            {/*<p className="max-w-4xl mx-auto mt-3 text-xl text-gray-300 sm:mt-5 sm:text-2xl">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit
              numquam eligendi quos odit doloribus molestiae voluptatum.
            </p>*/}
          </div>
          <div className="py-10 mx-auto bg-white max-w-7xl sm:py-16 sm:px-6 lg:px-8">
            {/* xs to lg */}
            <div className="max-w-2xl mx-auto lg:hidden">
              <div className="px-4">
                <h2 className="text-2xl font-medium leading-6 text-center text-gray-900">
                  {t('pricing.free')}
                </h2>
                <p className="mt-4 text-center">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {t('pricing.free')}
                  </span>
                </p>
                {/*<p className="mt-4 text-sm text-gray-500">Quis suspendisse ut fermentum neque vivamus non tellus.</p>*/}
                {/*{plan === null && (
                  <AppButton
                    label={t("pricing.get_started")}
                    className="primary-full"
                    handleClick={handleClickStartTrial(stripePriceFree)}
                  />
                )}
                {plan && plan.id === process.env.STRIPE_PRICE_FREE && (
                  <AppButton label="Current Plan" className="tertiary" />
                )}*/}
              </div>
              <table className="w-full mt-8">
                <caption className="px-4 py-3 text-sm font-medium text-left text-gray-900 border-t border-gray-200 bg-gray-50">
                  {t('header.features')}
                </caption>
                <thead>
                  <tr>
                    <th className="sr-only" scope="col">
                      {t('feature')}
                    </th>
                    <th className="sr-only" scope="col">
                      {t('included')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('features_full.number_of_locations')}
                    </th>
                    <td className="py-5 pr-4">
                      <span className="block text-sm text-gray-700">
                        {t('pricing.1_location')}
                      </span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.search_location')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only"> {t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.automatic_geocoding')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_map_theme')}
                    </th>
                    <td className="py-5 pr-4">
                      <span className="block text-sm text-gray-700">
                        {t('pricing.standard_map')}
                      </span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_header_color')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_font_color')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_marker')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/minus */}
                      <svg
                        className="w-5 h-5 ml-auto text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('no')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.bulk_uploading_of_locations')}{' '}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/minus */}
                      <svg
                        className="w-5 h-5 ml-auto text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('no')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.bulk_exporting_of_locations')}{' '}
                      <span className="text-xs italic font-medium text-yellow-500">
                        <em>({t('pricing.coming_soon')})</em>
                      </span>
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/minus */}
                      <svg
                        className="w-5 h-5 ml-auto text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('no')}</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Actions */}
              <FreePlanActions isMobileView />

              <div className="px-4 mt-16">
                <h2 className="text-2xl font-medium leading-6 text-center text-gray-900">
                  {t('pricing.lite')}
                </h2>
                <p className="mt-4 text-center">
                  <span className="text-4xl font-extrabold text-gray-900">
                    $19
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    {t('pricing.per_month')}
                  </span>
                </p>
                {/*<p className="mt-4 text-sm text-gray-500">Quis eleifend a tincidunt pellentesque. A tempor in sed.</p>*/}
                {/*{plan === null && (
                  <AppButton
                    label={t("pricing.get_started")}
                    className="primary-full"
                    handleClick={handleClickStartTrial(stripePriceLite)}
                  />
                )}

                {plan && plan.id === process.env.STRIPE_PRICE_LITE && (
                  <AppButton label="Current Plan" className="tertiary" />
                )}

                {plan && plan.id === process.env.STRIPE_PRICE_FREE && (
                  <AppButton
                    label="UPGRADE PLAN"
                    className="primary-full"
                    handleClick={() => {
                      setIsOpenModal(true);
                      setModalFooter(
                        <>
                          <AppButton
                            label="Upgrade Plan"
                            className="primary"
                            handleClick={handleClickChangeSubscription(
                              process.env.STRIPE_PRICE_LITE
                            )}
                          />
                          &nbsp; &nbsp;
                          <AppButton
                            label="Cancel"
                            className="tertiary"
                            handleClick={() => setIsOpenModal(false)}
                          />
                        </>
                      );
                    }}
                  />
                )}*/}
              </div>
              <table className="w-full mt-8">
                <caption className="px-4 py-3 text-sm font-medium text-left text-gray-900 border-t border-gray-200 bg-gray-50">
                  {t('header.features')}
                </caption>
                <thead>
                  <tr>
                    <th className="sr-only" scope="col">
                      {t('feature')}
                    </th>
                    <th className="sr-only" scope="col">
                      {t('included')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('features_full.number_of_locations')}
                    </th>
                    <td className="py-5 pr-4">
                      <span className="block text-sm text-gray-700">
                        {t('pricing.up_to_50_locations')}
                      </span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('features_full.search_locations')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('features_full.automatic_geocoding')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_map_theme')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_header_color')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_font_color')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_marker')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.bulk_uploading_of_locations')}{' '}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.bulk_exporting_of_locations')}{' '}
                      <span className="text-xs italic font-medium text-yellow-500">
                        <em>({t('pricing.coming_soon')})</em>
                      </span>
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Actions */}
              <LitePlanActions isMobileView />

              <div className="px-4 mt-16">
                <h2 className="text-2xl font-medium leading-6 text-center text-gray-900">
                  {t('plus')}
                </h2>
                <p className="mt-4 text-center">
                  <span className="text-4xl font-extrabold text-gray-900">
                    $39
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    {t('pricing.per_month')}
                  </span>
                </p>
                {/*<p className="mt-4 text-sm text-gray-500">Orci volutpat ut sed sed neque, dui eget. Quis tristique non.</p>*/}
                {/*{plan === null && (
                  <AppButton
                    label={t("pricing.get_started")}
                    className="primary-full"
                    handleClick={handleClickStartTrial(stripePricePlus)}
                  />
                )}
                {plan && plan.id === process.env.STRIPE_PRICE_PLUS && (
                  <AppButton label="Current Plan" className="tertiary" />
                )}
                {((plan && plan.id === process.env.STRIPE_PRICE_FREE) ||
                  (plan && plan.id === process.env.STRIPE_PRICE_LITE)) && (
                  <AppButton
                    label="UPGRADE PLAN"
                    className="primary-full"
                    handleClick={() => {
                      setIsOpenModal(true);
                      setModalFooter(
                        <>
                          <AppButton
                            label="Upgrade Plan"
                            className="primary"
                            handleClick={handleClickChangeSubscription(
                              process.env.STRIPE_PRICE_PLUS
                            )}
                          />
                          &nbsp; &nbsp;
                          <AppButton
                            label="Cancel"
                            className="tertiary"
                            handleClick={() => setIsOpenModal(false)}
                          />
                        </>
                      );
                    }}
                  />
                )}*/}
              </div>
              <table className="w-full mt-8">
                <caption className="px-4 py-3 text-sm font-medium text-left text-gray-900 border-t border-gray-200 bg-gray-50">
                  {t('header.features')}
                </caption>
                <thead>
                  <tr>
                    <th className="sr-only" scope="col">
                      {t('feature')}
                    </th>
                    <th className="sr-only" scope="col">
                      {t('included')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('features_full.number_of_locations')}
                    </th>
                    <td className="py-5 pr-4">
                      <span className="block text-sm text-gray-700">
                        {t('pricing.unlimited_locations')}
                      </span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('features_full.search_locations')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('features_full.automatic_geocoding')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_map_theme')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_header_color')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_font_color')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_marker')}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.bulk_uploading_of_locations')}{' '}
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="px-4 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.bulk_exporting_of_locations')}{' '}
                      <span className="text-xs italic font-medium text-yellow-500">
                        <em>({t('pricing.coming_soon')})</em>
                      </span>
                    </th>
                    <td className="py-5 pr-4">
                      {/* Heroicon name: solid/check */}
                      <svg
                        className="w-5 h-5 ml-auto text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{t('yes')}</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Actions */}
              <PlusPlanActions isMobileView />
            </div>

            {/* lg+ */}
            <div className="hidden lg:block">
              <table className="w-full h-px table-fixed">
                <caption className="sr-only">
                  {t('pricing.title')} plan comparison
                </caption>
                <thead>
                  <tr>
                    <th
                      className="sticky top-0 px-6 pb-4 text-sm font-medium text-left text-gray-900"
                      scope="col"
                    >
                      <span className="sr-only">{t('feature')} by</span>
                      <span>Plans</span>
                    </th>

                    <th
                      className="w-1/4 px-6 pb-4 text-2xl font-medium leading-6 text-left text-gray-900"
                      scope="col"
                    >
                      {t('pricing.free')}
                    </th>

                    <th
                      className="w-1/4 px-6 pb-4 text-2xl font-medium leading-6 text-left text-gray-900"
                      scope="col"
                    >
                      {t('pricing.lite')}
                    </th>

                    <th
                      className="w-1/4 px-6 pb-4 text-2xl font-medium leading-6 text-left text-gray-900"
                      scope="col"
                    >
                      {t('plus')}
                    </th>
                  </tr>
                </thead>
                <tbody className="border-t border-gray-200 divide-y divide-gray-200">
                  <tr>
                    <th
                      className="px-6 py-8 text-sm font-medium text-left text-gray-900 align-top"
                      scope="row"
                    >
                      {t('pricing.title')}
                    </th>

                    <td className="h-full px-6 py-8 align-top">
                      <div className="relative table w-full h-full">
                        <p>
                          <span className="text-4xl font-extrabold text-gray-900">
                            {t('pricing.free')}
                          </span>
                        </p>
                        {/*<p className="mt-4 mb-16 text-sm text-gray-500">Quis suspendisse ut fermentum neque vivamus non tellus.</p>*/}
                        {/*{plan === null && (
                          <AppButton
                            label={t("pricing.get_started")}
                            className="primary-full"
                            handleClick={handleClickStartTrial(stripePriceFree)}
                          />
                        )}
                        {plan && plan.id === process.env.STRIPE_PRICE_FREE && (
                          <AppButton
                            label="Current Plan"
                            className="tertiary"
                          />
                        )}*/}
                      </div>
                    </td>

                    <td className="h-full px-6 py-8 align-top">
                      <div className="relative table w-full h-full">
                        <p>
                          <span className="text-4xl font-extrabold text-gray-900">
                            $19
                          </span>
                          <span className="text-base font-medium text-gray-500">
                            {t('pricing.per_month')}
                          </span>
                        </p>
                        {/*<p className="mt-4 mb-16 text-sm text-gray-500">Quis eleifend a tincidunt pellentesque. A tempor in sed.</p>*/}
                        {/*{plan === null && (
                          <AppButton
                            label={t("pricing.get_started")}
                            className="primary-full"
                            handleClick={handleClickStartTrial(stripePriceLite)}
                          />
                        )}

                        {plan && plan.id === process.env.STRIPE_PRICE_LITE && (
                          <AppButton
                            label="Current Plan"
                            className="tertiary"
                          />
                        )}

                        {plan && plan.id === process.env.STRIPE_PRICE_FREE && (
                          <AppButton
                            label="UPGRADE PLAN"
                            className="primary-full"
                            handleClick={() => {
                              setIsOpenModal(true);
                              setModalFooter(
                                <>
                                  <AppButton
                                    label="Upgrade Plan"
                                    className="primary"
                                    handleClick={handleClickChangeSubscription(
                                      process.env.STRIPE_PRICE_LITE
                                    )}
                                  />
                                  &nbsp; &nbsp;
                                  <AppButton
                                    label="Cancel"
                                    className="tertiary"
                                    handleClick={() => setIsOpenModal(false)}
                                  />
                                </>
                              );
                            }}
                          />
                        )}*/}
                      </div>
                    </td>

                    <td className="h-full px-6 py-8 align-top">
                      <div className="relative table w-full h-full">
                        <p>
                          <span className="text-4xl font-extrabold text-gray-900">
                            $39
                          </span>
                          <span className="text-base font-medium text-gray-500">
                            {t('pricing.per_month')}
                          </span>
                        </p>
                        {/*<p className="mt-4 mb-16 text-sm text-gray-500">Orci volutpat ut sed sed neque, dui eget. Quis tristique non.</p>*/}
                        {/*{plan === null && (
                          <AppButton
                            label={t("pricing.get_started")}
                            className="primary-full"
                            handleClick={handleClickStartTrial(stripePricePlus)}
                          />
                        )}
                        {plan && plan.id === process.env.STRIPE_PRICE_PLUS && (
                          <AppButton
                            label="Current Plan"
                            className="tertiary"
                          />
                        )}
                        {((plan && plan.id === process.env.STRIPE_PRICE_FREE) ||
                          (plan &&
                            plan.id === process.env.STRIPE_PRICE_LITE)) && (
                          <AppButton
                            label="UPGRADE PLAN"
                            className="primary-full"
                            handleClick={() => {
                              setIsOpenModal(true);
                              setModalFooter(
                                <>
                                  <AppButton
                                    label="Upgrade Plan"
                                    className="primary"
                                    handleClick={handleClickChangeSubscription(
                                      process.env.STRIPE_PRICE_PLUS
                                    )}
                                  />
                                  &nbsp; &nbsp;
                                  <AppButton
                                    label="Cancel"
                                    className="tertiary"
                                    handleClick={() => setIsOpenModal(false)}
                                  />
                                </>
                              );
                            }}
                          />
                        )}*/}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th
                      className="py-3 pl-6 text-sm font-medium text-left text-gray-900 bg-gray-50"
                      colSpan="4"
                      scope="colgroup"
                    >
                      {t('header.features')}
                    </th>
                  </tr>

                  <tr>
                    <th
                      className="px-6 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('features_full.number_of_locations')}
                    </th>
                    <td className="px-6 py-5">
                      <span className="block text-sm text-gray-700">
                        {t('pricing.1_location')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="block text-sm text-gray-700">
                        {t('pricing.up_to_50_locations')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="block text-sm text-gray-700">
                        {t('pricing.unlimited_locations')}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <th
                      className="px-6 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('features_full.search_locations')}
                    </th>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_free')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_lite')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_plus')}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <th
                      className="px-6 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('features_full.automatic_geocoding')}
                    </th>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_free')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_lite')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_plus')}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <th
                      className="px-6 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_map_theme')}
                    </th>
                    <td className="px-6 py-5">
                      <span className="block text-sm text-gray-700">
                        {t('features_full.standard_map')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_lite')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_plus')}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <th
                      className="px-6 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_header_color')}
                    </th>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_free')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_lite')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_plus')}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <th
                      className="px-6 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_font_color')}
                    </th>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_free')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_lite')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_plus')}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <th
                      className="px-6 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.customized_marker')}
                    </th>
                    <td className="px-6 py-5">
                      <IconMinusSolid />
                      <span className="sr-only">
                        {t('features_full.not_included_in_free')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_lite')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_plus')}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <th
                      className="px-6 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.bulk_uploading_of_locations')}{' '}
                    </th>
                    <td className="px-6 py-5">
                      <IconMinusSolid />
                      <span className="sr-only">
                        {t('features_full.not_included_in_free')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_lite')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_plus')}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <th
                      className="px-6 py-5 text-sm font-normal text-left text-gray-500"
                      scope="row"
                    >
                      {t('pricing.bulk_exporting_of_locations')}{' '}
                      <span className="text-xs italic font-medium text-yellow-500">
                        <em>({t('pricing.coming_soon')})</em>
                      </span>
                    </th>
                    <td className="px-6 py-5">
                      <IconMinusSolid />
                      <span className="sr-only">
                        {t('features_full.not_included_in_free')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_lite')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <IconCheckSolid />
                      <span className="sr-only">
                        {t('features_full.include_in_plus')}
                      </span>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200">
                    <th className="sr-only" scope="row">
                      {t('plans.choose_plan')}
                    </th>

                    <td className="px-6 pt-5">
                      <FreePlanActions />
                    </td>

                    <td className="px-6 pt-5">
                      <LitePlanActions />
                    </td>

                    <td className="px-6 pt-5">
                      <PlusPlanActions />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FeaturesFull
