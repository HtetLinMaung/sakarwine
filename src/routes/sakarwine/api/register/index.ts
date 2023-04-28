import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import bcrypt from "bcrypt";
import validator from "validator";
import User from "../../../../models/User";
import connectMongoose from "../../../../utils/connect-mongoose";

const emailIsValid = (email: string) => {
  return validator.isEmail(email);
};

const passwordIsValid = (password: string) => {
  // Minimum 8 characters, at least 1 letter and 1 number
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(password);
};

const usernameIsValid = (username: string) => {
  // Minimum 3 characters, maximum 30 characters, alphanumeric
  const regex = /^[a-zA-Z0-9]{3,30}$/;
  return regex.test(username);
};

export default brewBlankExpressFunc(async (req, res) => {
  await connectMongoose();
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

  if (!emailIsValid(email)) {
    throwErrorResponse(400, "Invalid email format");
  }

  if (!passwordIsValid(password)) {
    throwErrorResponse(
      400,
      "Password must have at least 8 characters, including at least 1 letter and 1 number"
    );
  }

  if (!usernameIsValid(username)) {
    throwErrorResponse(
      400,
      "Username must be 3-30 characters long and contain only alphanumeric characters"
    );
  }

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
    fullName: firstName && lastName ? `${firstName} ${lastName}` : "",
    bio,
    location,
    language,
    timezone,
  });

  await newUser.save();

  res.status(201).json({
    code: 201,
    message: "User registered successfully",
    data: newUser,
  });
});
