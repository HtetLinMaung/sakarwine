import {
  brewBlankExpressFunc,
  brewExpressFuncCreateOrFindAll,
} from "code-alchemy";
import Room from "../../../../models/Room";
import verifyToken from "../../../../utils/verify-token";

export default brewBlankExpressFunc(async (req, res) => {
  const method = req.method.toLowerCase();
  const decoded = verifyToken(req);
  if (method == "get") {
    const rooms = await Room.find({ participants: decoded.id }).populate(
      "participants"
    );
    res.json({
      code: 200,
      message: "Rooms fetch successfully",
      data: rooms,
    });
  } else if (method == "post") {
    const { name, participants } = req.body;

    const room = new Room({
      name,
      participants: [decoded.id, ...participants],
    });

    const savedRoom = await room.save();
    res.status(201).json({
      code: 201,
      message: "Room created successfully",
      data: savedRoom,
    });
  } else {
    res.sendStatus(404);
  }
});
