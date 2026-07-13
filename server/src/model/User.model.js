import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide unique username"],
      unique: [true, "Username Exists"],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      unique: false,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: [true, "User already created on this email"],
    },
    role: {
      type: String,
      required: [true, "Please provide role"],
      unique: false,
    },
    profilePicture: {
      type: String,
    },
    picturePath: {
      type: String,
      default: "",
    },
    aboutme: {
      type: String,
      default: "Put your bio here !",
    },
    friends: {
      type: Array,
      default: [],
    },
    likedPosts: {
      type: Array,
      unique: false,
    },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: Number },
    address: { type: String },
    location: String,
    viewedProfile: Number,
    impressions: Number,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: null,
    },
    verificationCodeExpiry: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model.Users || mongoose.model("User", UserSchema);
