// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { priceId } = JSON.parse(req.body);
  // See https://stripe.com/docs/api/checkout/sessions/create
  // for additional parameters to pass.
  //  = req.protocol + '://' + req.url + req.originalUrl;
  var referer = req.headers.referer;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/plans/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${referer}?canceled=true`,
    });

    res.send({
      sessionId: session.id,
    });
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      },
    });
  }
};
