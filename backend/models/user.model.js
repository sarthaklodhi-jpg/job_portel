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
    github: String,
    linkedin: String,
    portfolio: String,
    resume: String,
    resumeUrl: String,
    resumeOriginalName: String,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    designation: String,
    experience: String,
    location: String,
    companyName: String,
    companyWebsite: String,
    companyDescription: String,
    companyLogo: String,
    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
  },
}, { timestamps: true });



export const User = mongoose.model('User', userSchema);


