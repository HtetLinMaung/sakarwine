import fs from "fs";

export default function saveBase64AsFile(
  base64String: string,
  filePath: string
) {
  const data = base64String.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(data, "base64");
  fs.writeFileSync(filePath, buffer);
}
