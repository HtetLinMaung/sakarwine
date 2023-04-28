import { brewBlankExpressFunc } from "code-alchemy";
import { asyncEach } from "starless-async";
import server from "starless-server";
import Room from "../../../../models/Room";
import verifyToken from "../../../../utils/verify-token";
import connectMongoose from "../../../../utils/connect-mongoose";
import Message from "../../../../models/Message";

export default brewBlankExpressFunc(async (req, res) => {
  const method = req.method.toLowerCase();
  const decoded = verifyToken(req);
  await connectMongoose();
  if (method == "get") {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "20");
    const skip = (page - 1) * limit;
    const rooms = await Room.find({ participants: decoded.id })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("participants");
    const roomsWithLatestMessages = await asyncEach(rooms, async (room) => {
      const latestMessage = await Message.findOne({ roomId: room._id })
        .sort({ createdAt: -1 })
        .populate("sender", "name");

      return {
        ...room.toJSON(),
        id: room._id,
        latestMessage: latestMessage ? latestMessage.toJSON() : null,
      };
    });
    res.json({
      code: 200,
      message: "Rooms fetch successfully",
      data: roomsWithLatestMessages,
    });
  } else if (method == "post") {
    const { name, type, participants } = req.body;

    const room = new Room({
      name,
      type,
      participants: [decoded.id, ...participants],
    });

    const savedRoom = await room.save();
    const io = server.getIO();
    if (io) {
      io.to(savedRoom.participants).emit("roomCreate");
    }
    res.status(201).json({
      code: 201,
      message: "Room created successfully",
      data: savedRoom,
    });
  } else {
    res.sendStatus(404);
  }
});
