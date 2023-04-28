export default (io: any, socket: any) => () => {
  io.emit("roomUpdate");
};
