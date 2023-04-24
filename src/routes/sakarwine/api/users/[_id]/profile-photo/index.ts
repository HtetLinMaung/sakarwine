import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import fs from "fs";
import verifyToken from "../../../../../../utils/verify-token";
import saveBase64AsFile from "../../../../../../utils/save-base64-as-file";
import User from "../../../../../../models/User";

export default brewBlankExpressFunc(async (req, res) => {
  const method = req.method.toLowerCase();
  const decoded = verifyToken(req);
  const userId = req.params._id;
  if (method == "post") {
    const { profilePicture } = req.body;

    if (decoded.id !== userId) {
      throwErrorResponse(
        403,
        "Not authorized to update this user's profile photo"
      );
    }

    const filePath = `uploads/${Date.now()}-profile-photo.png`;
    saveBase64AsFile(profilePicture, filePath);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: filePath },
      { new: true }
    );

    res.json({
      code: 200,
      message: "Profile photo uploaded/updated successfully",
      data: updatedUser,
    });
  } else if (method == "delete") {
    if (decoded.id !== userId) {
      throwErrorResponse(
        403,
        "Not authorized to delete this user's profile photo"
      );
    }

    const user = await User.findById(userId);
    if (!user || !user.profilePicture) {
      return res.status(404).json({ error: "Profile photo not found" });
    }

    fs.unlinkSync(user.profilePicture); // Delete the profile picture file
    user.profilePicture = undefined; // Remove the profilePicture field from the user document
    await user.save();

    res.json({
      code: 200,
      message: "Profile photo deleted successfully",
      data: user,
    });
  } else {
    res.sendStatus(404);
  }
});
