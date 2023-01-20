import { useMutation } from '@apollo/client'
import { getSession } from '@auth0/nextjs-auth0'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import LetsGetStarted from '../../../../components/dashboard/homepage/LetsGetStarted.js'
import PaymentSuccess from '../../../../components/dashboard/plans/PaymentSuccess'
import DashboardLayout from '../../../../components/layouts/dashboard/DashboardLayout'
import { USER_UPDATE_ONE_MUTATION } from '../../../../graphql/payment-sucess/user.mutation'

function Index({ data, session }) {
  const router = useRouter()
  const query = {
    auth_id: session.user.sub.replace('auth0|', ''),
  }
  const set = {
    stripe_customer_id: data.customer_id,
  }

  const [
    updateStripeCustomerId,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(USER_UPDATE_ONE_MUTATION, {
    variables: {
      query: query,
      set: set,
    },
  })

  useEffect(() => {
    if (!data.error) {
      updateStripeCustomerId()
    }
  }, [data])

  useEffect(() => {
    window.location.href = '/dashboard'
  }, [])

  if (!session) return null
  return (
    <div>
      <DashboardLayout
        session={session}
        key={session?.user?.plan?.id}
        headerPlanLoading
      >
        <Head>
          <title>Plans</title>
          <meta property="og:title" content="MapStuff.io" key="title" />
        </Head>
        <PaymentSuccess />
        <LetsGetStarted />
      </DashboardLayout>
    </div>
  )
}

export default Index

export async function getServerSideProps(context) {
  const res = await fetch(
    process.env.NEXTAUTH_URL + '/api/stripe/update-stripe-customer-id',
    {
      method: 'POST',
      body: JSON.stringify(context.query),
    },
  )
  const data = await res.json()

  // const Stripe = require('stripe')
  // const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

  const session = getSession(context.req, context.res)
  const res_plan = await fetch(process.env.NEXTAUTH_URL + '/api/stripe/me', {
    method: 'POST',
    body: JSON.stringify({
      session: session,
    }),
  })

  if (session) {
    const plan = await res_plan.json()
    session.user.plan = plan.plan
  }

  return {
    props: { data, session: JSON.parse(JSON.stringify(session)) },
  }
}
