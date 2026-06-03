const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateProfileUpdate = (req, res, next) => {
  const { email, fullname, phoneNumber, bio, skills } = req.body;

  if (email && !EMAIL_REGEX.test(String(email).trim().toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  if (fullname && String(fullname).trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Full name should be at least 2 characters",
    });
  }

  if (phoneNumber && String(phoneNumber).trim().length < 8) {
    return res.status(400).json({
      success: false,
      message: "Phone number looks invalid",
    });
  }

  if (bio && String(bio).length > 500) {
    return res.status(400).json({
      success: false,
      message: "Bio cannot exceed 500 characters",
    });
  }

  if (skills && String(skills).length > 1000) {
    return res.status(400).json({
      success: false,
      message: "Skills payload is too large",
    });
  }

  next();
};

export default validateProfileUpdate;
