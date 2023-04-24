import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import bcrypt from "bcrypt";
import verifyToken from "../../../../../../utils/verify-token";
import User from "../../../../../../models/User";

export default brewBlankExpressFunc(async (req, res) => {
  const method = req.method.toLowerCase();
  if (method != "put") {
    return res.sendStatus(404);
  }

  const userId = req.params._id;
  const { oldPassword, newPassword } = req.body;
  const decoded = verifyToken(req);

  if (decoded.id !== userId) {
    throwErrorResponse(403, "Not authorized to update this user's password");
  }

  const user = await User.findById(userId);
  if (!user) {
    throwErrorResponse(404, "User not found!");
  }

  const isValidPassword = await bcrypt.compare(oldPassword, user.password);
  if (!isValidPassword) {
    throwErrorResponse(400, "Invalid old password!");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  res.json({
    code: 200,
    message: "Password updated successfully",
  });
});
