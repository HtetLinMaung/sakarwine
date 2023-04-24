import { log } from "starless-logger";
import fs from "fs";
import connectMongoose from "./utils/connect-mongoose";
import { uploadsFolderPath } from "./constants";

export const afterMasterProcessStart = async () => {
  await connectMongoose();
  log("Mongo Db connection established.");
  if (!fs.existsSync(uploadsFolderPath)) {
    fs.mkdirSync(uploadsFolderPath);
  }
};

export const afterSocketConnected = async (io: any, socket: any) => {
  log(`User connected: ${socket.id}`);
};
