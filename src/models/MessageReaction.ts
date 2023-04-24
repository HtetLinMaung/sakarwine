import mongoose, { Document, Schema } from "mongoose";

export interface IMessageReaction extends Document {
  messageId: string;
  userId: string;
  reactionType: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageReactionSchema: Schema = new Schema(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reactionType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MessageReaction = mongoose.model<IMessageReaction>(
  "MessageReaction",
  messageReactionSchema
);
export default MessageReaction;
