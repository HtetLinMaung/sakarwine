import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import bcrypt from "bcrypt";
import User, { IUser } from "../../../../models/User";

export default brewBlankExpressFunc(async (req, res) => {
  const {
    email,
    password,
    username,
    firstName,
    lastName,
    bio,
    location,
    language,
    timezone,
  } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throwErrorResponse(400, "User with this email already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({
    email,
    password: hashedPassword,
    username,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    bio,
    location,
    language,
    timezone,
  });

  await newUser.save();

  res.status(201).json({
    code: 200,
    message: "User registered successfully",
    data: newUser,
  });
});
