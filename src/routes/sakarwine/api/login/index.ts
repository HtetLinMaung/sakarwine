import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../../../models/User";
import connectMongoose from "../../../../utils/connect-mongoose";

export default brewBlankExpressFunc(async (req, res) => {
  await connectMongoose();
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    throwErrorResponse(401, "Invalid email!");
  }

  // Compare the provided password with the hashed password in the database
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throwErrorResponse(401, "Invalid password!");
  }

  // Generate a JWT
  const secretKey = process.env.JWT_SECRET; // Store this in an environment variable in a production app
  const expiresIn = process.env.JWT_EXPIRES_IN; // Token expiration time
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    secretKey,
    {
      expiresIn,
    }
  );

  res.json({
    code: 200,
    message: "Logged in successfully",
    data: {
      token,
      user,
    },
  });
});
