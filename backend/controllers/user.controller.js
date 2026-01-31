// ==========================================
// 📂 FILE: controllers/user.controller.js
// ==========================================

import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import { attachResumeDownloadUrl } from "../utils/resume.js";

// ==========================================
// 🧩 REGISTER CONTROLLER
// ==========================================
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

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
    if (req.file && req.file.buffer) {
      const fileUri = getDataUri(req.file);
      const uploadRes = await cloudinary.uploader.upload(fileUri.content, {
        folder: "profile_photos",
        resource_type: "image",
      });
      profilePhoto = uploadRes.secure_url;
    }

    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: { profilePhoto },
    });

    let userData = {
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      role: newUser.role,
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
   console.log("🔥 LOGIN HIT");
  console.log("ENV CHECK:", {
    SECRET_KEY: !!process.env.SECRET_KEY,
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
  });
  
  try {
    const { email, password, role } = req.body;

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
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.profile) user.profile = {};

    // ===============================
    // 🧠 SKILLS
    // ===============================
    let skillsArray = [];
    if (skills) {
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
    if (skillsArray.length) user.profile.skills = skillsArray;

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
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const completeProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { phoneNumber, password, role } = req.body;
    const file = req.file ?? null;

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
    if (file && file.buffer) {
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

    user.phoneNumber = phoneNumber;
    user.password = hashedPassword;
    user.role = role;
    user.isProfileComplete = true;
    user.authProvider = "local";

    await user.save();

    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      user,
    });
  } catch (error) {
    console.error("Complete profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



