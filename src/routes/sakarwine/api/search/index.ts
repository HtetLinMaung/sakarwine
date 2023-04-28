import { brewBlankExpressFunc } from "code-alchemy";
import connectMongoose from "../../../../utils/connect-mongoose";
import verifyToken from "../../../../utils/verify-token";
import User from "../../../../models/User";
import Room from "../../../../models/Room";

export default brewBlankExpressFunc(async (req, res) => {
  verifyToken(req);
  await connectMongoose();

  const query: string = req.query.q as string;

  let users = [];
  let rooms = [];

  if (!query) {
    users = await User.find().limit(10);
    rooms = await Room.find({
      type: "group",
    }).limit(10);
  } else {
    const regex = new RegExp(query, "i");

    users = await User.find({ username: { $regex: regex } }).limit(10);
    rooms = await Room.find({
      type: "group",
      name: { $regex: regex },
    }).limit(10);
  }

  res.json({
    code: 200,
    message: "Success",
    data: {
      users,
      rooms,
    },
  });
});
