import { Company } from "../models/company.model.js"; // fixed import path and spacing

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    // ✅ Check for missing field
    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "Company name is required.",
      });
    }

    // ✅ Check if company already exists
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        success: false,
        message: "Company already exists.",
      });
    }

  company = await Company.create({
        name: companyName,
        userId: req.id, 
    });
    // ✅ Respond success
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

export const getCompany = async (req, res) => {
  try {
    const userId = req.id; // logged-in user ID (set in auth middleware)

    // ✅ Fetch all companies owned by this user
    const companies = await Company.find({ userId });

    // ✅ If no companies found
    if (!companies || companies.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No companies found for this user.",
      });
    }

    // ✅ Return the list of companies
    return res.status(200).json({
      success: true,
      message: "Compa nies fetched successfully.",
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

export const getCompanyById = async (req, res) => {
    try {
        const  companyId  = req.params.id;
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
    }
}


export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    const updateData = { name, description, website, location };

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

