import { throwErrorResponse } from "code-alchemy";
import { Request } from "express";
import jwt from "jsonwebtoken";

export default function verifyToken(req: Request) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throwErrorResponse(401, "Authorization header is missing");
  }

  const token = authHeader.split(" ")[1];
  try {
    const secretKey = process.env.JWT_SECRET;
    const decoded: any = jwt.verify(token, secretKey);
    (req as any).decodedToken = decoded;
    return decoded;
  } catch (error) {
    throwErrorResponse(403, error.message);
  }
}
