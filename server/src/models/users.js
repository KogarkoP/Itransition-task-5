import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    terms_privacy: { type: Boolean, required: true },
    isVerified: { type: Boolean, default: false },
    emailToken: { type: String },
    isBlocked: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
