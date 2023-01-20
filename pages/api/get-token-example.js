import jwt from "next-auth/jwt";

const secret = process.env.JWT_SIGNING_PRIVATE_KEY;

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret, raw: true });
  res.send({
    token,
  });
};
