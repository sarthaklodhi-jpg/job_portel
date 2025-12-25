// ==========================================
// 📂 FILE: controllers/auth.controller.js
// ==========================================

// 1️⃣ Import required modules
import { User } from "../models/user.model.js"; // Mongoose User model
import bcrypt from "bcryptjs";                  // Password hashing
import jwt from "jsonwebtoken";                 // Token generation
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";
import  getDataUri  from "../utils/datauri.js";
// ==========================================
// 🧩 REGISTER CONTROLLER
// ==========================================
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    // ✅ Validate fields
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ===============================
    // ✅ PROFILE PHOTO UPLOAD (FIXED)
    // ===============================
    let profilePhoto = "";

    if (req.file && req.file.buffer) {
      const fileUri = getDataUri(req.file);

      const cloudResponse = await cloudinary.uploader.upload(
        fileUri.content,
        {
          folder: "profile_photos",
          resource_type: "image",
        }
      );

      profilePhoto = cloudResponse.secure_url;
    }

    // ✅ Create user
    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
        profile: newUser.profile,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


// ==========================================
// 🧩 LOGIN CONTROLLER
// ==========================================
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // ✅ Validate input fields
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });
    }

    // ✅ Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false
      });
    }

    // ✅ Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false
      });
    }

    // ✅ Validate user role
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false
      });
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d"
    });

    // ✅ Remove password before sending
    user.password = undefined;

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict"
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: userData,
        success: true
      });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

// ==========================================
// 🧩 LOGOUT CONTROLLER
// ==========================================
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ==========================================
// 🧩 UPDATE PROFILE CONTROLLER
// ==========================================
// ==========================================
// 🧩 UPDATE PROFILE CONTROLLER (DiskStorage Version)
// ==========================================
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    const userId = req.id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Ensure profile object exists
    if (!user.profile) user.profile = {};

    // ✅ Convert skills
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

    // ✅ Update basic fields
    if (fullname) user.fullname = fullname.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (phoneNumber) user.phoneNumber = phoneNumber.trim();
    if (bio) user.profile.bio = bio.trim();
    if (skillsArray.length > 0) user.profile.skills = skillsArray;

    // ===============================
    // ✅ RESUME UPLOAD (FIXED)
    // ===============================
    if (file && file.buffer) {
      const fileUri = getDataUri(file);

    const cloudResponse = await cloudinary.uploader.upload(
  fileUri.content,
  {
    resource_type: "raw",
    folder: "resumes",
    use_filename: true,
    unique_filename: false,
    flags: "attachment", // ⭐ THIS IS THE MAGIC
  }
);


      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();
    user.password = undefined;

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      success: false,
    });
  }
};


/*Frontend (React)
   ↓ (formData with file)
Backend (Express + Multer)
   ↓ saves file → /uploads/resume-123.pdf
   ↓ passes req.file.path
Cloudinary
   ↓ uploads that file from disk
   ↓ returns public URL
MongoDB
   ↓ store the Cloudinary URL
Frontend
   ↓ displays resume using that URL
*/