import Message from "../models/Message";

export default (io: any, socket: any) =>
  async (roomId: string, messageData: any) => {
    const { content, sender, mediaAttachment } = messageData;
    const newMessage = new Message({
      content,
      sender,
      roomId,
      mediaAttachment,
    });
    const savedMessage = await newMessage.save();

    io.to(roomId).emit("newMessage", savedMessage);
  };
