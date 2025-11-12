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
    
  }
])

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  )
}

export default App
