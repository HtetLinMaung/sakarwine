import mongoose, { Document, Schema } from "mongoose";

export interface IRoom extends Document {
  name: string;
  type: string;
  participants: string[]; // Array of user IDs
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema: Schema = new Schema(
  {
    name: { type: String, default: "" },
    type: {
      type: String,
      enum: ["group", "direct"],
      required: true,
      default: "group",
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model<IRoom>("Room", roomSchema);
export default Room;
