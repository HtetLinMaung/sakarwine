import { log } from "starless-logger";

export default (io: any, socket: any) => () => {
  log(`User disconnected: ${socket.id}`);
};
