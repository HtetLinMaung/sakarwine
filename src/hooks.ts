import { log } from "starless-logger";
import fs from "fs";
import { uploadsFolderPath } from "./constants";

export const afterMasterProcessStart = async () => {
  if (!fs.existsSync(uploadsFolderPath)) {
    fs.mkdirSync(uploadsFolderPath);
  }
};

export const afterSocketConnected = async (io: any, socket: any) => {
  log(`User connected: ${socket.id}`);
};
