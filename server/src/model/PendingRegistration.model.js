import mongoose from "mongoose";

// Data is kept here only until the owner verifies the email address.
const PendingRegistrationSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    profile: { type: String, default: "" },
    picturePath: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    verificationCode: { type: String, required: true },
    verificationCodeExpiry: { type: Date, required: true },
  },
  { timestamps: true },
);

PendingRegistrationSchema.index(
  { verificationCodeExpiry: 1 },
  { expireAfterSeconds: 0 },
);

export default mongoose.model.PendingRegistration ||
  mongoose.model("PendingRegistration", PendingRegistrationSchema);
