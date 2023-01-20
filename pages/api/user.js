import { getSession } from "@auth0/nextjs-auth0";

export default async function User(req, res) {
  if (req.method == "POST") {
    try {
      const data = req.body;
      const session = getSession(req, res);

      // Retrieve an access token to allow us to call the Auth0 Management API /api/v2/users endpoint.
      // TODO: This token should be cached and used for subsequent calls.
      const token = await fetch(
        "https://mapstuff-dev.us.auth0.com/oauth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grant_type: "client_credentials",
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: "https://mapstuff-dev.us.auth0.com/api/v2/",
          }),
        }
      ).then((res) => res.json());

      // Get current user's sub id and update user profile in Auth0 with new edited values
      const { user } = await getSession(req, res);

      console.log(user.sub.replace("auth0|", ""), "haroldddd");
      const updatedUser = await fetch(
        `https://mapstuff-dev.us.auth0.com/api/v2/users/${user.sub}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      ).then((res) => res.json());

      console.log("/asdas/user " + updatedUser);

      // TODO: Need to write some error logic if Auth0 call fails (like when an email address already exists)

      // Return updated user
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error, "asdasdsa");
    }
  } else {
    return res.status(405).json({ msg: "Method not implemented." });
  }
}
