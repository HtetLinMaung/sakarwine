import { brewBlankExpressFunc } from "code-alchemy";
import { uploadsFolderPath } from "../../../../../constants";
import path from "path";
import fs from "fs";
import mime from "mime";

export default brewBlankExpressFunc(async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsFolderPath, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ code: 404, message: "File not found" });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  // Set appropriate content type based on the file extension
  const ext = path.extname(filename);
  const contentType = mime.getType(ext) || "application/octet-stream";

  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;

    const fileStream = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": contentType,
    });

    fileStream.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": contentType,
    });

    fs.createReadStream(filePath).pipe(res);
  }
});
