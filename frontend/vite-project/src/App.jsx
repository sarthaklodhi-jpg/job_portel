import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { Button } from "./components/ui/button"
import Navbar from "./components/shared/navbar.jsx"
import Home from "./lib/home.jsx"
import Jobs from "./components/jobs.jsx"
import Login from "./components/auth/login.jsx"
import Signup from "./components/auth/signup.jsx"
import Browse from "./components/browse.jsx"
import Profile from "./components/profile.jsx"
import Jobdescription from "./components/jobdescription.jsx"
import Companies from "./components/admin/companies.jsx";
import CompanyCreate from "./components/admin/companycreate";
import CompanySetup from "./components/admin/companysetup.jsx";
import React from "react";
import AdminJobs from "./components/admin/adminjobs.jsx";
import PostJobs from "./components/admin/postjobs"
import Applicants from "./components/admin/applicants"
import ProtectedRoute from "./components/admin/protectedroute"

const appRouter = createBrowserRouter([
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
    path: "/jobs",
    element: <Jobs/>,
    
  },
  {
    path: "/description/:id",
    element: <Jobdescription/>,
    
  },
  {
    path: "/browse",
    element: <Browse/>,
    
  },
   {
    path: "/profile",
    element: <Profile/>,
    
  },
    
  {
  path: "/admin/companies",
  element: <ProtectedRoute><Companies /></ProtectedRoute> ,
},
{
  path: "/admin/companies/create",
  element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>  ,
},

{
  path: "/admin/companies/:id",
  element: <ProtectedRoute><CompanySetup /></ProtectedRoute>  ,
},


{
  path: "/admin/jobs",
  element: <ProtectedRoute><AdminJobs/></ProtectedRoute> ,
},

{
  path: "/admin/jobs/create",
  element: <ProtectedRoute><PostJobs/></ProtectedRoute>  ,
},

{
  path: "/admin/jobs/:id/applicants",
  element: <ProtectedRoute><Applicants/></ProtectedRoute> ,
},

 
    
    
])

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  )
}

export default App
