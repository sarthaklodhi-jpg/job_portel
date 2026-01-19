import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const client = new OAuth2Client(); // 👈 no client ID here

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    // ✅ VERIFY GOOGLE TOKEN (FIXED)
    const ticket = await client.verifyIdToken({
      idToken: token,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullname: name,
        email,
        authProvider: "google",
        googleId: sub,
        isProfileComplete: false,
        profile: {
          profilePhoto: picture,
        },
      });
    }

    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res
      .cookie("token", jwtToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        user,
        isProfileComplete: user.isProfileComplete,
      });

  } catch (error) {
    console.error("Google login error:", error);
    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};
