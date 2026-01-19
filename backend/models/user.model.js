import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phoneNumber: {
    type: String,
    required: false, // ❗ Google users won’t have this
  },

  password: {
    type: String,
    required: false, // ❗ allow Google users
  },

  role: {
    type: String,
    enum: ["student", "recruiter"],
    required: false,
  },

  // 👇 NEW FIELDS
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },

  googleId: {
    type: String,
  },

  isProfileComplete: {
  type: Boolean,
  default: false,
}
,
  profile: {
    bio: String,
    skills: [String],
    resume: String,
    resumeOriginalName: String,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
  },
}, { timestamps: true });



export const User = mongoose.model('User', userSchema);


