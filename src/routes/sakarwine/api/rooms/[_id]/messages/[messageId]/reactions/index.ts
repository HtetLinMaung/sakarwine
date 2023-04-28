import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import verifyToken from "../../../../../../../../utils/verify-token";
import Message from "../../../../../../../../models/Message";
import MessageReaction from "../../../../../../../../models/MessageReaction";
import connectMongoose from "../../../../../../../../utils/connect-mongoose";

export default brewBlankExpressFunc(async (req, res) => {
  const method = req.method.toLowerCase();
  if (method != "post") {
    return res.sendStatus(404);
  }
  await connectMongoose();
  const decoded = verifyToken(req);
  const messageId = req.params.messageId;
  const { reactionType } = req.body;

  const message = await Message.findById(messageId);

  if (!message) {
    throwErrorResponse(404, "Message not found");
  }

  const newReaction = new MessageReaction({
    messageId,
    userId: decoded.id,
    reactionType,
  });
  const savedReaction = await newReaction.save();

  res.json({
    code: 200,
    message: "Reaction added successfully",
    data: savedReaction,
  });
});
