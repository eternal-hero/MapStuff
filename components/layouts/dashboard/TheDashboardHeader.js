import React from 'react'
import AppButton from '../../global/AppButton'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

const TheDashboardHeader = ({ children, session, headerPlanLoading }) => {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <>
      <div>
        {/* Page header */}
        <div className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
              <div className="flex-1 min-w-0">
                {/* Profile */}
                <div className="flex items-center">
                  <div>
                    <div className="flex items-center">
                      <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 uppercase sm:leading-9 sm:truncate">
                        {/* CD (KO on 20210117): phase 2 - add geolocation greeting to user based on time of day (Good Morning / Afternoon / Evening) */}
                        {t('dashboard.header.account_status')}
                        <br />
                        <span className="text-lg font-normal">
                          {session && session.user.email}
                        </span>
                      </h1>
                    </div>
                    <dl className="flex flex-col mt-6 sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                      <dt className="sr-only">
                        {t('dashboard.header.account_status')}
                      </dt>
                      <dd className="flex items-center mt-3 text-sm font-medium text-gray-500 sm:mr-6 sm:mt-0">
                        {/* Heroicon name: check-circle */}
                        <svg
                          className={
                            session.user.plan && session.user.plan.nickname
                              ? 'flex-shrink-0 mr-1.5 h-5 w-5 text-sky-500'
                              : 'flex-shrink-0 mr-1.5 h-5 w-5 text-red-500'
                          }
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>

                        {session.user.plan && session.user.plan.nickname ? (
                          <>
                            {headerPlanLoading
                              ? t('plans.loading_plan_info')
                              : t('plans.user', {
                                plan: session.user.plan.nickname,
                              })}
                          </>
                        ) : (
                          <span>
                            {t('help_guides_support.choose_plan_to_create_map')}
                          </span>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="flex mt-6 space-x-3 md:mt-0 md:ml-4">
                <AppButton
                  className="secondary"
                  label={t('help_guides_support.create_map')}
                  handleClick={() => router.push('/dashboard/locations')}
                />
                <AppButton
                  className="primary"
                  label={t('upgrade')}
                  handleClick={() => router.push('/dashboard/plans')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TheDashboardHeader
