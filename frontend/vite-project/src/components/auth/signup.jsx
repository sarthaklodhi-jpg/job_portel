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


const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  })

   const {loading} = useSelector(store => store.auth);
const dispatch = useDispatch();
  const navigate = useNavigate()

  // Handles text & radio inputs
 const changeEventHandler = (e) => {
  setInput({ ...input, [e.target.name]: e.target.value });
};


  // Handles file input (for profile picture)
  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] })
  }

  // Handles form submission
  const submitHandler = async (e) => {
    e.preventDefault() // Prevent page refresh
console.log("Submitting:", input);

    // 🔹 FormData allows sending both text + file data
    const formData = new FormData()
    formData.append("fullname", input.fullname)
    formData.append("email", input.email)
    formData.append("phoneNumber", input.phoneNumber)
    formData.append("password", input.password)
    formData.append("role", input.role)

    if (input.file) {
      formData.append("file", input.file)
    }

    try {
      dispatch(setLoading(true));


      // 🔹 axios.post → sends formData to backend
      // "multipart/form-data" → tells server request contains files
      // withCredentials:true → allows cookies/sessions if backend uses them
      const res = await axios.post(
        `${USER_API_END_POINT}/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      )

      // ✅ If signup successful → navigate to login page
      if (res.data.success) {
        toast.success(res.data.message)
        navigate("/login")
      }

      console.log("Response:", res.data)
    } catch (error) {
      console.error("Error:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "Signup failed")
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
            Sign Up
          </h1>

          {/* Full Name */}
          <div className="mb-5">
            <Label htmlFor="fullname" className="block mb-1 font-medium">
              Full Name
            </Label>
            <Input
              type="text"
              value={input.fullname}
              onChange={changeEventHandler}
              name="fullname"
              id="fullname"
              placeholder="Patel"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <Label htmlFor="email" className="block mb-1 font-medium">
              Email
            </Label>
            <Input
              type="email"
              value={input.email}
              onChange={changeEventHandler}
              name="email"
              id="email"
              placeholder="you@example.com"
            />
          </div>

   {/* Phone Number */}
          <div className="mb-5">
            <Label htmlFor="phonenumber" className="block mb-1 font-medium">
              Phone Number
            </Label>
            <Input
              type="text"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              name="phoneNumber"
              id="phonenumber"
              placeholder="+1234567890"
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
  placeholder="Enter password"
/>


          </div>

         

          {/* Role + File Upload */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-6 mb-8">
            {/* Role */}
            <div>
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
                  />
                  <Label htmlFor="r2">Recruiter</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Profile Upload */}
            <div className="flex flex-col gap-2">
              <Label className="font-medium">Upload Profile</Label>
              <Input
                accept="image/*"
                type="file"
                onChange={changeFileHandler}
              />
            </div>
          </div>

         {
        loading? <Button className = "w-full my-4"><Loader2
        className = "mr-2 h-4 w-4 animate-spin"/>please wait</Button>:  <Button className="w-full bg-[#F83802] hover:bg-[#d52e00] text-white font-semibold py-2 text-lg rounded-lg">
           Sign up
          </Button>
     }

          {/* Already have account */}
          <p className="text-center text-sm text-gray-600 mt-5">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#F83802] font-medium hover:underline"
            >
              Log In
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
