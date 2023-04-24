export default (io: any, socket: any) => (roomId: string) => {
  socket.leave(roomId);
};
