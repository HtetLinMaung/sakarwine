import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import verifyToken from "../../../../../../utils/verify-token";
import Room from "../../../../../../models/Room";
import Message from "../../../../../../models/Message";

export default brewBlankExpressFunc(async (req, res) => {
  const method = req.method.toLowerCase();
  if (method != "get") {
    return res.sendStatus(404);
  }
  const decoded = verifyToken(req);
  const roomId = req.params._id;
  const room = await Room.findById(roomId);

  if (!room) {
    throwErrorResponse(404, "Room not found");
  }

  if (
    !room.participants.some(
      (participant) => participant.toString() === decoded.id
    )
  ) {
    throwErrorResponse(403, "You are not a participant in this room");
  }

  const messages = await Message.find({ room: roomId })
    .populate("sender")
    .populate("readBy");
  res.json({
    code: 200,
    message: "Room messages fetch success",
    data: messages,
  });
});
