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
      requirements: Array.isArray(requirements)
        ? requirements
        : requirements.split(",").map((item) => item.trim()).filter(Boolean),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: Number(experience),
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
    // ✅ Extract search keyword from query params
    const keyword = req.query.keyword || "";

    // ✅ Create a MongoDB search filter (query)
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    // Handle location filter
    if (keyword === "Delhi NCR") {
      query.$or = [
        { location: { $regex: "delhi", $options: "i" } },
        { location: { $regex: "ncr", $options: "i" } },
      ];
    } else if (keyword === "Bangalore") {
      query.$or = [{ location: { $regex: "bangalore", $options: "i" } }];
    } else if (keyword === "Hyderabad") {
      query.$or = [{ location: { $regex: "hyderabad", $options: "i" } }];
    } else if (keyword === "Pune") {
      query.$or = [{ location: { $regex: "pune", $options: "i" } }];
    } else if (keyword === "Mumbai") {
      query.$or = [{ location: { $regex: "mumbai", $options: "i" } }];
    }

    // Handle salary range filter
    if (keyword === "0 - 40k") {
      query.$or = undefined;
      query.salary = { $gte: 0, $lte: 40000 };
    } else if (keyword === "40k - 1 Lakh") {
      query.$or = undefined;
      query.salary = { $gt: 40000, $lte: 100000 };
    } else if (keyword === "1 Lakh - 5 Lakh") {
      query.$or = undefined;
      query.salary = { $gt: 100000, $lte: 500000 };
    }

    // Handle industry/role filter
    if (keyword === "Frontend Developer") {
      query.$or = [{ title: { $regex: "frontend", $options: "i" } }];
    } else if (keyword === "Backend Developer") {
      query.$or = [{ title: { $regex: "backend", $options: "i" } }];
    } else if (keyword === "Full Stack Developer") {
      query.$or = [
        { title: { $regex: "full stack", $options: "i" } },
        { title: { $regex: "fullstack", $options: "i" } },
      ];
    }

    // ✅ Fetch jobs from DB
    const jobs = await Job.find(query)
      .populate({
        path: "company"
      })
      .sort({ createdAt: -1 });

    // ✅ If no jobs found
    if (!jobs || jobs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No jobs found.",
        count: 0,
        jobs: [],
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
        path: "company"
      })
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
      return res.status(200).json({
        success: true,
        message: "No jobs found for this admin.",
        jobs: [],
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



