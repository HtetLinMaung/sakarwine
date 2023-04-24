import { brewBlankExpressFunc } from "code-alchemy";
import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";

const pipe = promisify(pipeline);
import { uploadsFolderPath } from "../../../../constants";
import verifyToken from "../../../../utils/verify-token";

export default brewBlankExpressFunc(async (req, res) => {
  const method = req.method.toLowerCase();
  if (method != "post") {
    return res.sendStatus(404);
  }
  verifyToken(req);
  // Directory where the uploaded files will be saved
  const uploadDir = uploadsFolderPath;

  // Generate a unique file name
  const uniqueFileName = `${Date.now()}-${req.headers["x-original-filename"]}`;
  const saveTo = path.join(uploadDir, uniqueFileName);

  // Save the file to disk
  await pipe(req, fs.createWriteStream(saveTo));
  res.json({
    code: 200,
    message: "Upload complete",
    data: uniqueFileName,
  });
});
