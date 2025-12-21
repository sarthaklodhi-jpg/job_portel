import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

// ================= REGISTER COMPANY =================
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    // ✅ Validation (unchanged)
    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "Company name is required.",
      });
    }

    // ✅ Check duplicate (unchanged)
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        success: false,
        message: "Company already exists.",
      });
    }

    // ✅ NEW: handle logo upload (OPTIONAL)
    let logoUrl = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(
        fileUri.content
      );
      logoUrl = cloudResponse.secure_url;
    }

    // ✅ Create company (same fields + logo)
    company = await Company.create({
      name: companyName,
      logo: logoUrl,
      userId: req.id,
    });

    return res.status(201).json({
      success: true,
      message: "Company registered successfully.",
      company,
    });

  } catch (error) {
    console.error("Error in registerCompany:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// ================= GET USER COMPANIES =================
export const getCompany = async (req, res) => {
  try {
    const userId = req.id;

    const companies = await Company.find({ userId });

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No companies found for this user.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Companies fetched successfully.",
      companies,
    });

  } catch (error) {
    console.error("Error in getCompany:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// ================= GET COMPANY BY ID =================
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company fetched successfully.",
      company,
    });

  } catch (error) {
    console.error("Error in getCompanyById:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

// ================= UPDATE COMPANY =================
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    const updateData = { name, description, website, location };

    // ✅ NEW: update logo if file sent
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(
        fileUri.content
      );
      updateData.logo = cloudResponse.secure_url;
    }

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company information updated successfully.",
      company,
    });

  } catch (error) {
    console.error("Error in updateCompany:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};


export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Optional safety check (owner)
    if (company.userId.toString() !== req.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await Company.findByIdAndDelete(companyId);

    return res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
