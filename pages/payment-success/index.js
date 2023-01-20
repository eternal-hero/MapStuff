
import { getSession } from "@auth0/nextjs-auth0";
import { USER_UPDATE_ONE_MUTATION } from "../../graphql/payment-sucess/user.mutation";

import { useMutation } from "@apollo/client";
import { useEffect } from "react";
export default function Index({ data, session }) {
  const query = {
    auth_id: session.user.sub.replace('auth0|', ''),
  };
  const set = {
    stripe_customer_id: data.customer_id,
  };
  const [
    updateStripeCustomerId,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(USER_UPDATE_ONE_MUTATION, {
    variables: {
      query: query,
      set: set,
    },
  });

  useEffect(() => {
    if (!data.error) {
      updateStripeCustomerId();
    }
  }, [data]);

  if (typeof window !== "undefined" && loading) return null;

  if (!session) return <p>Access Denied</p>;

  return !data.error ? "Payment is successful" : data.error.message;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const Stripe = require("stripe");
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  const res = await fetch(
    process.env.NEXTAUTH_URL + "/api/stripe/update-stripe-customer-id",
    {
      method: "POST",
      body: JSON.stringify(context.query),
    }
  );
  const data = await res.json();

  return {
    props: { session, data },
  };
}
