export default (io: any, socket: any) => (roomId: string) => {
  socket.join(roomId);
};
