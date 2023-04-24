import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  sender: string;
  content: string;
  roomId: string;
  mediaAttachment: {
    type: string;
    url: string;
  };
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema: Schema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    mediaAttachment: {
      type: {
        type: String,
        enum: ["image", "video", "audio", "file"],
        required: false,
      },
      url: { type: String, required: false },
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
