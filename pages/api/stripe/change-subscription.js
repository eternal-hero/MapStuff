// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
import client from "../../../lib/apollo-client";
import { getSession } from "next-auth/client";
import { USER_QUERY } from "../../../graphql/user.query";

export default async (req, res) => {
  const { priceId, session } = JSON.parse(req.body);
  const fetch_user = await client.query({
    query: USER_QUERY,
    variables: {
      query: {
        auth_id: session.user.sub.replace('auth0|',''),
      },
    },
  });

  var user = fetch_user.data.user;

  const customer = await stripe.customers.retrieve(user.stripe_customer_id);

  const subscription_id = customer.subscriptions.data[0].id;

  const subscription = await stripe.subscriptions.retrieve(subscription_id);

  const updated_subscription = await stripe.subscriptions.update(subscription_id, {
    cancel_at_period_end: false,
    proration_behavior: "create_prorations",
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
  });

  res.send({
    updated_subscription,
  });
};
