// ==========================================
// 📂 FILE: controllers/user.controller.js
// ==========================================

import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import { attachResumeDownloadUrl } from "../utils/resume.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { ApiError } from "../middlewares/errorHandler.js";

const sanitizeFileBaseName = (filename = "resume") =>
  filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "resume";

const getFileExtension = (filename = "") => {
  const match = filename.match(/\.[a-zA-Z0-9]+$/);
  return match ? match[0].toLowerCase() : "";
};

const getUploadedFile = (req, fieldName) => {
  if (req.files?.[fieldName]?.[0]) return req.files[fieldName][0];
  if (fieldName === "profilePhoto" && req.files?.file?.[0]) return req.files.file[0];
  if (fieldName === "profilePhoto" && req.file) return req.file;
  return null;
};

const uploadProfilePhoto = async (file) => {
  const fileUri = getDataUri(file);
  const uploadRes = await cloudinary.uploader.upload(fileUri.content, {
    folder: "profile_photos",
    resource_type: "image",
  });
  return uploadRes.secure_url;
};

const uploadResume = async (file) => {
  const fileUri = getDataUri(file);
  const extension = getFileExtension(file.originalname);
  const publicId = `${Date.now()}-${sanitizeFileBaseName(file.originalname)}${extension}`;

  return cloudinary.uploader.upload(fileUri.content, {
    resource_type: "raw",
    folder: "resumes",
    public_id: publicId,
    use_filename: false,
    unique_filename: false,
  });
};

// ==========================================
// 🧩 REGISTER CONTROLLER
// ==========================================
export const register = async (req, res) => {
  try {
    const { fullname, phoneNumber, password, role } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Optional profile photo
    let profilePhoto = "";
    const profilePhotoFile = getUploadedFile(req, "profilePhoto");
    if (profilePhotoFile?.buffer) {
      try {
        profilePhoto = await uploadProfilePhoto(profilePhotoFile);
      } catch (uploadError) {
        console.error("Profile photo upload failed:", uploadError.message);
      }
    }

    let resume = "";
    let resumeUrl = "";
    let resumeOriginalName = "";
    const resumeFile = getUploadedFile(req, "resume");
    if (role === "student" && resumeFile?.buffer) {
      try {
        const uploadRes = await uploadResume(resumeFile);
        resume = uploadRes.public_id;
        resumeUrl = uploadRes.secure_url;
        resumeOriginalName = resumeFile.originalname;
      } catch (uploadError) {
        console.error("Resume upload failed:", uploadError.message);
      }
    }

    const newUser = await User.create({
      fullname: fullname.trim(),
      email,
      phoneNumber: phoneNumber.trim(),
      password: hashedPassword,
      role,
      authProvider: "local",
      isProfileComplete: true,
      profile: { profilePhoto, resume, resumeUrl, resumeOriginalName },
    });

    let userData = {
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      role: newUser.role,
      authProvider: newUser.authProvider,
      isProfileComplete: newUser.isProfileComplete,
      profile: newUser.profile,
    };

    userData = attachResumeDownloadUrl(userData);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Register error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)[0]?.message || "Invalid signup details",
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// 🧩 LOGIN CONTROLLER
// ==========================================
const isProd = process.env.NODE_ENV === "production";

export const login = async (req, res) => {
  try {
    const { password, role } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google login. Please continue with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        success: false,
        message: "Account doesn't exist with this role",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    user.password = undefined;

    let userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      authProvider: user.authProvider,
      isProfileComplete: user.isProfileComplete,
      profile: user.profile,
    };

    userData = attachResumeDownloadUrl(userData);

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
      })
      .json({
        success: true,
        message: `Welcome back ${user.fullname}`,
        user: userData,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// 🧩 LOGOUT CONTROLLER
// ==========================================
export const logout = async (req, res) => {
  return res
    .status(200)
    .cookie("token", "", { maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

// ==========================================
// 🧩 UPDATE PROFILE CONTROLLER
// ==========================================
export const updateProfile = asyncHandler(async (req, res) => {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const {
      designation,
      location,
      experience,
      companyName,
      companyWebsite,
      companyDescription,
      linkedin,
      github,
      portfolio,
      twitter,
    } = req.body;
    const userId = req.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.profile) user.profile = {};

    // ===============================
    // 🧠 SKILLS
    // ===============================
    let skillsArray = [];
    if (typeof skills === "string" && skills.trim()) {
      try {
        skillsArray = JSON.parse(skills);
      } catch {
        skillsArray = skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    // ===============================
    // 🧾 BASIC FIELDS
    // ===============================
    if (fullname) user.fullname = fullname.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (phoneNumber) user.phoneNumber = phoneNumber.trim();
    if (bio) user.profile.bio = bio.trim();
    if (Array.isArray(skillsArray)) user.profile.skills = skillsArray;
    if (github !== undefined) user.profile.github = String(github || "").trim();
    if (linkedin !== undefined) user.profile.linkedin = String(linkedin || "").trim();
    if (portfolio !== undefined) user.profile.portfolio = String(portfolio || "").trim();

    if (designation !== undefined) user.profile.designation = String(designation || "").trim();
    if (location !== undefined) user.profile.location = String(location || "").trim();
    if (experience !== undefined) user.profile.experience = String(experience || "").trim();
    if (companyName !== undefined) user.profile.companyName = String(companyName || "").trim();
    if (companyWebsite !== undefined) user.profile.companyWebsite = String(companyWebsite || "").trim();
    if (companyDescription !== undefined) user.profile.companyDescription = String(companyDescription || "").trim();
    user.profile.socialLinks = {
      ...(user.profile.socialLinks || {}),
      linkedin: String(linkedin || user.profile.socialLinks?.linkedin || "").trim(),
      twitter: String(twitter || user.profile.socialLinks?.twitter || "").trim(),
      website: String(companyWebsite || user.profile.socialLinks?.website || "").trim(),
    };

    // ===============================
    // 📸 PROFILE PHOTO
    // ===============================
    if (req.files?.profilePhoto?.[0]) {
      const file = req.files.profilePhoto[0];
      const fileUri = getDataUri(file);

      const uploadRes = await cloudinary.uploader.upload(
        fileUri.content,
        {
          folder: "profile_photos",
          resource_type: "image",
        }
      );

      user.profile.profilePhoto = uploadRes.secure_url;
    }

    if (req.files?.companyLogo?.[0]) {
      const file = req.files.companyLogo[0];
      const fileUri = getDataUri(file);
      const uploadRes = await cloudinary.uploader.upload(fileUri.content, {
        folder: "company_logos",
        resource_type: "image",
      });
      user.profile.companyLogo = uploadRes.secure_url;
    }

    // ===============================
    // 📄 RESUME
    // ===============================
    if (req.files?.resume?.[0]) {
      const file = req.files.resume[0];
      const fileUri = getDataUri(file);

      const uploadRes = await cloudinary.uploader.upload(
        fileUri.content,
        {
          resource_type: "raw",
          folder: "resumes",
          use_filename: true,
          unique_filename: false,
        }
      );

      user.profile.resume = uploadRes.public_id;
      user.profile.resumeUrl = uploadRes.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();
    user.password = undefined;

    const updatedUser = attachResumeDownloadUrl(user.toObject());

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
});


export const completeProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { phoneNumber, password, role } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!phoneNumber || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Phone number, password and role are required",
      });
    }

    if (!["student", "recruiter"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ ENSURE PROFILE EXISTS
    if (!user.profile) {
      user.profile = {};
    }

    // ✅ OPTIONAL PROFILE PHOTO
    const profilePhotoFile = getUploadedFile(req, "profilePhoto");
    if (profilePhotoFile?.buffer) {
      try {
        user.profile.profilePhoto = await uploadProfilePhoto(profilePhotoFile);
      } catch (uploadError) {
        console.error("Profile photo upload failed:", uploadError.message);
      }
    }

    const resumeFile = getUploadedFile(req, "resume");
    if (role === "student" && resumeFile?.buffer) {
      try {
        const uploadRes = await uploadResume(resumeFile);
        user.profile.resume = uploadRes.public_id;
        user.profile.resumeUrl = uploadRes.secure_url;
        user.profile.resumeOriginalName = resumeFile.originalname;
      } catch (uploadError) {
        console.error("Resume upload failed:", uploadError.message);
      }
    }

    user.phoneNumber = phoneNumber;
    user.password = hashedPassword;
    user.role = role;
    user.isProfileComplete = true;

    await user.save();

    user.password = undefined;

    const updatedUser = attachResumeDownloadUrl(user.toObject());

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Complete profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



