import { Job } from "../models/job.model.js"; // ✅ fixed import path

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.id; // assuming this comes from isAuthenticated middleware

    // ✅ validate all required fields
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        success: false,
        message: "Something is missing in the job details.",
      });
    }

    // ✅ create new job
    const job = await Job.create({
      title,
      description,
      requirements, // should be an array (e.g., ["HTML", "CSS"])
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position: Number(position),
      company: companyId,
      created_by: userId,
    });

    res.status(201).json({
      success: true,
      message: "Job posted successfully!",
      job,
    });
  } catch (error) {
    console.error("❌ Error while posting job:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// ==========================================
// 📂 FILE: controllers/job.controller.js
// ==========================================


// ==========================================
// 🧩 GET ALL JOBS (with optional keyword search)
// ==========================================
export const getAllJobs = async (req, res) => {
  try {
    // ✅ Extract search keyword from query params (example: /api/v1/jobs?keyword=react)
    // If no keyword is provided, it defaults to an empty string ""
    const keyword = req.query.keyword || "";

    // ✅ Create a MongoDB search filter (query)
    // The `$or` operator means: match documents where
    // EITHER the title OR the description contains the keyword.
    // `$regex` allows partial matches like SQL's "LIKE" — case-insensitive using `$options: 'i'`.
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    // ✅ Fetch jobs from DB
    // 1. `.find(query)` — get all jobs matching the filter
    // 2. `.populate("company")` — replace company ObjectId with full company document
    // 3. `.sort({ createdAt: -1 })` — sort newest jobs first
    const jobs = await Job.find(query)
      .populate({
        path: "company"
      }) // includes company details
      .sort({ createdAt: -1 }); // newest first

    // ✅ If no jobs found
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No jobs found.",
      });
    }

    // ✅ Return response
    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully.",
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Error in getAllJobs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// ==========================================
// 📂 FILE: controllers/job.controller.js
// ==========================================


// ==========================================
// 🧩 GET JOB BY ID
// ==========================================
export const getJobById = async (req, res) => {
  try {
    // ✅ Extract job ID from URL parameters
    // Example request: GET /api/v1/jobs/6725d4c1abc123
    const jobId = req.params.id;

    // ✅ Fetch the job by ID from database
    // `.populate("company")` → Optional: includes company details
    const job = await Job.findById(req.params.id)
      .populate({
        path: "applications"
      }) // 👈 this is the key
      .exec();

    // ✅ If job not found
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // ✅ Send success response
    return res.status(200).json({
      success: true,
      message: "Job fetched successfully.",
      job,
    });
  } catch (error) {
    console.error("Error in getJobById:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};
// ✅ getAdminJobs - Fetch all jobs created by a particular admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id; // ID from auth middleware (logged-in admin)

    // Find all jobs created by this admin
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company"
    });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No jobs found for this admin.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin jobs fetched successfully.",
      jobs,
    });
  } catch (error) {
    console.error("Error in getAdminJobs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};




export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



