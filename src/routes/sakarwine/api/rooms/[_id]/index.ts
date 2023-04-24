import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import Room from "../../../../../models/Room";
import verifyToken from "../../../../../utils/verify-token";

export default brewBlankExpressFunc(async (req, res) => {
  const method = req.method.toLowerCase();
  if (method != "get" && method != "put" && method != "delete") {
    return res.sendStatus(404);
  }
  verifyToken(req);

  let room = null;
  const roomId = req.params._id;
  if (method == "get" || method == "put") {
    room = await Room.findById(roomId).populate("participants");
  }
  if (!room) {
    throwErrorResponse(404, "Room not found!");
  }

  if (method == "get") {
    res.json({
      code: 200,
      message: "Room fetch successfully",
      data: room,
    });
  } else if (method == "put") {
    const { name, participants } = req.body;

    room.name = name || room.name;
    room.participants = participants || room.participants;

    const updatedRoom = await room.save();
    res.json({
      code: 200,
      message: "Room updated successfully",
      data: updatedRoom,
    });
  } else if (method == "delete") {
    await Room.findByIdAndDelete(roomId);
    res.json({
      code: 204,
      message: "Room deleted successfully",
    });
  }
});
