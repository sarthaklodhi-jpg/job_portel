import { Application } from "../models/application.model.js"; // fixed import path
import { Job } from "../models/job.model.js"; // fixed import path

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    console.log("🟩 Apply API Hit");
    console.log("User ID:", userId);
    console.log("Job ID:", jobId);

    if (!jobId) {
      console.log("❌ Job ID missing");
      return res.status(400).json({ message: "Job ID is required.", success: false });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      console.log("❌ Job not found");
      return res.status(404).json({ message: "Job not found.", success: false });
    }

    // ✅ Check if already applied
    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication) {
      console.log("❌ Already applied");
      return res.status(400).json({
        message: "You have already applied for this job.",
        success: false,
      });
    }

    // ✅ Create new application
    const newApplication = await Application.create({ job: jobId, applicant: userId });

    // ✅ Avoid pushing duplicate IDs into job.applications
    if (!job.applications.includes(newApplication._id)) {
      job.applications.push(newApplication._id);
      await job.save();
    }

    console.log("✅ Application created successfully!");
    return res.status(201).json({
      message: "Job applied successfully!",
      success: true,
      application: newApplication,
    });
  } catch (error) {
    console.error("❌ Error in applyJob:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    // Fetch all applications by the logged-in user
    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });

    // Check if no applications exist
    if (!applications || applications.length === 0) {
      return res.status(404).json({
        message: "No applications found.",
        success: false,
      });
    }

    // Success response
    return res.status(200).json({
      applications,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Check if job exists and populate applicants
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    // If job not found
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // Send response with applicants
    return res.status(200).json({
      totalApplicants: job.applications.length,
      applicants: job.applications,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    // Validation: status required
    if (!status) {
      return res.status(400).json({
        message: "Status is required.",
        success: false,
      });
    }

    // Find application by ID
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // Update status
    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
      updatedStatus: application.status,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
