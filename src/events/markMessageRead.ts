import Message from "../models/Message";

export default (io: any, socket: any) => async (data: any, callback: any) => {
  try {
    const { messageId, userId } = data;
    const message = await Message.findById(messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    // Add user to the readBy array if not already there
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
      await message.save();
    }

    // Emit event to inform other clients
    io.to(message.roomId).emit("messageRead", { messageId, userId });

    // Acknowledge success
    if (callback) {
      callback({ status: "success", messageId, userId });
    }
  } catch (error) {
    console.error("Error marking message read:", error);
    if (callback) {
      callback({ status: "error", error: error.message });
    }
  }
};
