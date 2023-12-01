import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = await req.header("Authorization");

    if (!token) return res.status(500).json("not authorize");

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verify = await jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

    req.body.userId = await verify.id;
    req.header.userId = await verify.id;

    next();
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
