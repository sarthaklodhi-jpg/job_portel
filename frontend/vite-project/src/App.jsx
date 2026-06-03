import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

/* ===== Common Pages ===== */
import Home from "./lib/home.jsx";
import Jobs from "./components/jobs.jsx";
import Login from "./components/auth/login.jsx";
import Signup from "./components/auth/signup.jsx";
import Browse from "./components/browse.jsx";
import Profile from "./components/profile.jsx";
import RecruiterProfile from "./components/recruiterprofile.jsx";
import Jobdescription from "./components/jobdescription.jsx";
import CompleteProfile from "./components/CompleteProfile.jsx";

/* ===== Recruiter (Admin) Pages ===== */
import Companies from "./components/admin/companies.jsx";
import CompanyCreate from "./components/admin/companycreate.jsx";
import CompanySetup from "./components/admin/companysetup.jsx";
import AdminJobs from "./components/admin/adminjobs.jsx";
import PostJobs from "./components/admin/postjobs.jsx";
import Applicants from "./components/admin/applicants.jsx";
import ProtectedRoute from "./components/admin/protectedroute.jsx";

/* ===== Dashboards ===== */
import StudentDashboard from "../src/components/studentdashboard.jsx";
import RecruiterDashboard from "../src/components/recruiterdashboard.jsx";

const appRouter = createBrowserRouter([
  /* ===== PUBLIC ROUTES ===== */
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/complete-profile",
    element: (
      <ProtectedRoute requireCompleteProfile={false}>
        <CompleteProfile />
      </ProtectedRoute>
    ),
  },

  /* ===== STUDENT ROUTES ===== */
  {
    path: "/student/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <StudentDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/description/:id",
    element: <Jobdescription />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <Profile />
      </ProtectedRoute>
    ),
  },

  /* ===== RECRUITER ROUTES ===== */
  {
    path: "/recruiter/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <RecruiterDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter/profile",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <RecruiterProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/create",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <CompanyCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/:id",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <AdminJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/create",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <PostJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <Applicants />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
