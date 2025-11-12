import React from "react"
import { Link } from "react-router-dom"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { User2, LogOut } from "lucide-react"
import { useSelector } from "react-redux"
import { USER_API_END_POINT } from "../../utils/constant.js"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { setUser } from "../../redux/authslice.js"

const Navbar = () => {
 
  const {user} = useSelector(store => store.auth);
 const dispatch = useDispatch();
 const navigate = useNavigate();
  const logouthandler = async () => {
  try {
    const res = await axios.get(`${USER_API_END_POINT}/logout` , { withCredentials: true });
   if(res.data.success)
   {
    dispatch(setUser(null));
    navigate("/");
    toast.success("Logout Successful");
   }

  }
  catch (error) {
    console.log("Logout failed:", error);
  }
  }



  return (                       
    <div className="bg-white shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between mx-auto w-[92%] h-20 px-6 rounded-xl">
        {/* Logo */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
            Job<span className="text-[#F83802]">Portal</span>
          </h1>
        </div>

        {/* Menu + Avatar / Auth Buttons */}
        <div className="flex items-center gap-16">
          <ul className="flex font-semibold items-center gap-8 text-gray-700">
            <li className="hover:text-[#F83802] transition-colors duration-200 cursor-pointer">
             <Link to ="/"> Home</Link>
            </li>
            <li className="hover:text-[#F83802] transition-colors duration-200 cursor-pointer">
              <Link to ="/jobs"> Jobs</Link>
            </li>
            <li className="hover:text-[#F83802] transition-colors duration-200 cursor-pointer">
              <Link to ="/browse"> Browse</Link>
            </li>
          </ul>

           { !user ? (
            <div className="flex items-center gap-3">
            <Link to ="/login"> <Button>Login</Button></Link>
            <Link to ="/signup"><Button>Signup</Button></Link>
             
              
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                <Avatar className="cursor-pointer w-12 h-12">
  <AvatarImage
    src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
    alt={user?.fullname || "User"}
  />
</Avatar>


                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-64">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                  <Avatar className="cursor-pointer w-12 h-12">
  <AvatarImage
    src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
    alt={user?.fullname || "User"}
  />
</Avatar>


                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user?.fullname}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.profile?.bio || "No bio available"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col text-gray-600 gap-2">
                  <div className="flex items-center gap-2 cursor-pointer w-fit">
                    <User2 className="h-4 w-4" />
                    <Button variant="link" className="p-0 h-auto text-gray-700">
                     <Link to ="/profile">Profile</Link>
                    </Button>
                  </div>

                  <div className="flex cursor-pointer items-center gap-2 cursor-pointer w-fit">
                    <LogOut className="h-4 w-4" />
                    <Button onClick= {logouthandler} variant="link" className="p-0 h-auto text-gray-700">
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
