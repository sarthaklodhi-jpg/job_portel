import React, { useState } from "react"
import Navbar from "../shared/navbar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup } from "@/components/ui/radio-group"
import axios from "axios"
import { USER_API_END_POINT } from "../../utils/constant.js"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { setLoading } from "@/redux/authslice"
import {useDispatch, useSelector} from 'react-redux'
import { Loader2 } from "lucide-react"
import { setUser } from "@/redux/authslice"


const Login = () => {
  const navigate = useNavigate(); // ✅ 
  // initialize navigate

  const dispatch = useDispatch();
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const {loading} = useSelector(store => store.auth);

  // Handles text and radio input changes
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  // Handles form submit
  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      // Sends login data to backend API
      // "application/json" → standard format for text-based data
      // withCredentials:true → allows cookies/sessions for authentication
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user)); 
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error("Error:", error.response?.data || error.message);
    }
    finally{
        dispatch(setLoading(false));
    }
  }


  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto py-12 px-4">
        <form
          onSubmit={submitHandler}
          className="w-full sm:w-2/3 md:w-1/2 border border-gray-200 rounded-2xl shadow-md p-8 bg-white"
        >
          <h1 className="font-bold text-3xl mb-8 text-center text-[#F83802]">
            Log In
          </h1>

          {/* Email */}
          <div className="mb-5">
            <Label htmlFor="email" className="block mb-1 font-medium">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              id="email"
              placeholder="you@example.com"
              className="w-full"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <Label htmlFor="password" className="block mb-1 font-medium">
              Password
            </Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              id="password"
              placeholder="••••••••"
              className="w-full"
            />
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <Label className="block mb-2 font-medium">Select Role</Label>
            <RadioGroup className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  id="r1"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r1">Student</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  id="r2"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>

     {
        loading? <Button className = "w-full my-4"><Loader2
        className = "mr-2 h-4 w-4 animate-spin"/>please wait</Button>:  <Button className="w-full bg-[#F83802] hover:bg-[#d52e00] text-white font-semibold py-2 text-lg rounded-lg">
            Log In
          </Button>
     }
          {/* Submit Button */}

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-5">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-[#F83802] font-medium hover:underline"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
