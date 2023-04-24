import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  language?: string;
  timezone?: string;
  createdAt: Date;
  updatedAt: Date;
  lastOnline?: Date;
  status?: string;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    profilePicture: { type: String },
    bio: { type: String },
    location: { type: String },
    language: { type: String },
    timezone: { type: String },
    lastOnline: { type: Date },
    status: {
      type: String,
      default: "online",
      enum: ["online", "offline", "busy", "away"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
