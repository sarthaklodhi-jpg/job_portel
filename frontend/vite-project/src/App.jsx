import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

/* ===== Common Pages ===== */
import Home from "./lib/home.jsx";
import Jobs from "./components/jobs.jsx";
import Login from "./components/auth/login.jsx";
import Signup from "./components/auth/signup.jsx";
import Browse from "./components/browse.jsx";
import Profile from "./components/profile.jsx";
import Jobdescription from "./components/jobdescription.jsx";
import CompleteProfile from "./components/CompleteProfile.jsx";

/* ===== Recruiter (Admin) Pages ===== */
import Companies from "./components/admin/companies.jsx";
import CompanyCreate from "./components/admin/companycreate.jsx";
import CompanySetup from "./components/admin/companysetup.jsx";
import AdminJobs from "./components/admin/adminjobs.jsx";
import PostJobs from "./components/admin/postjobs.jsx";
import Applicants from "./components/admin/applicants.jsx";

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
    element: <CompleteProfile />,
  },

  /* ===== STUDENT ROUTES ===== */
  {
    path: "/student/dashboard",
    element: <StudentDashboard />,
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
    element: <Profile />,
  },

  /* ===== RECRUITER ROUTES ===== */
  {
    path: "/recruiter/dashboard",
    element: <RecruiterDashboard />,
  },
  {
    path: "/admin/companies",
    element: <Companies />,
  },
  {
    path: "/admin/companies/create",
    element: <CompanyCreate />,
  },
  {
    path: "/admin/companies/:id",
    element: <CompanySetup />,
  },
  {
    path: "/admin/jobs",
    element: <AdminJobs />,
  },
  {
    path: "/admin/jobs/create",
    element: <PostJobs />,
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <Applicants />,
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
