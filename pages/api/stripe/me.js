import client from "../../../lib/apollo-client";
// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
import { USER_QUERY } from "../../../graphql/user.query";

export default async (req, res) => {
  const { session } = await JSON.parse(req.body);
  if (session) {
    const fetch_user = await client.query({
      query: USER_QUERY,
      variables: {
        query: {
          auth_id: session.user.sub.replace('auth0|', ''),
        },
      },
    });

    var user = fetch_user.data.user;
    if (user?.stripe_customer_id) {
      try {
        // Signed in
        const customer = await stripe.customers.retrieve(
          user.stripe_customer_id
        );
        return res.send({
          plan: customer.subscriptions.data[0].plan,
        });
      } catch (e) {
        res.status(400);
        return res.send({
          error: {
            message: e.message,
          },
        });
      }
    } else {
      /*
        CD (JD on 20210903): 
        Added a default value of FREE PLAN in the session object {plcdan} whenever session is created. 
      */
      res.send({
        plan: {
          id: process.env.STRIPE_PRICE_FREE,
          nickname: "Free Plan"
        },
      });
    }
  } else {
      /*
        CD (JD on 20210903): 
        Added a default value of FREE PLAN in the session object {plan} whenever session is created. 
      */
    res.send({
      plan: {
        id: process.env.STRIPE_PRICE_FREE,
        nickname: "Free Plan"
      },
    });
  }
};
