import { useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import Head from 'next/head'

import DashboardLayout from '../../../components/layouts/dashboard/DashboardLayout'
import Plans from '../../../components/global/Plans'
import { getSession } from '@auth0/nextjs-auth0'
import { useTranslation } from 'react-i18next'

function Index({ session, planRes }) {
  const [plan, setPlan] = useState(planRes)
  const [isPlanUpgraded, setIsPlanUpgraded] = useState(0)
  const { t } = useTranslation()

  useEffect(() => {
    setPlan(planRes)
    setIsPlanUpgraded(isPlanUpgraded + 1)
  }, [planRes])

  if (!session) return null

  return (
    <div>
      <DashboardLayout
        key={isPlanUpgraded}
        session={{
          ...session,
          user: {
            ...session.user,
            plan: plan,
          },
        }}
      >
        <Head>
          <title>{t('plans.title')}</title>
          <meta property="og:title" content="MapStuff.io" key="title" />
        </Head>
        <Plans session={session} plan={plan} setPlan={setPlan} />
      </DashboardLayout>
    </div>
  )
}

export default Index

export async function getServerSideProps(context) {
  var plan = null
  let session = await getSession(context.req, context.res)
  const res = await fetch(process.env.NEXTAUTH_URL + '/api/stripe/me', {
    method: 'POST',
    body: JSON.stringify({
      session: session,
    }),
  })

  if (session) {
    let resPlan = await res.json()
    plan = resPlan.plan
  }
  return {
    props: { session: JSON.parse(JSON.stringify(session)), planRes: plan },
  }
}
