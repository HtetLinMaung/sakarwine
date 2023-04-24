import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import MessageReaction from "../../../../../../../../../models/MessageReaction";
import verifyToken from "../../../../../../../../../utils/verify-token";

export default brewBlankExpressFunc(async (req, res) => {
  const method = req.method.toLowerCase();
  if (method != "delete") {
    return res.sendStatus(404);
  }
  const decoded = verifyToken(req);
  const messageId = req.params.messageId;
  const reactionId = req.params.reactionId;

  const reaction = await MessageReaction.findById(reactionId);

  if (!reaction) {
    throwErrorResponse(404, "Reaction not found!");
  }

  if (reaction.messageId.toString() !== messageId) {
    throwErrorResponse(
      400,
      "Reaction does not belong to the specified message!"
    );
  }

  if (reaction.userId.toString() !== decoded.id) {
    throwErrorResponse(403, "You are not authorized to remove this reaction");
  }
  await MessageReaction.findByIdAndRemove(reactionId);

  res.json({
    code: 200,
    message: "Reaction removed",
  });
});
