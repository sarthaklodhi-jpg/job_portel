//ye lib mai nahi hona tha isse components mai hona tha
import React, { useEffect } from 'react'
import Navbar from '../components/shared/navbar.jsx'
import HeroSection from '../components/herosection.jsx'
import CategoryCarousel from '../components/categorycarousel.jsx'
import LatestJob from '../components/latestjob.jsx'
import Footer from '@/components/shared/footer.jsx'
import useGetAllJobs from '../hook/usegetalljobs.jsx'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Companies from '../components/admin/companies.jsx'


const home = () => {
  useGetAllJobs();

  const {user}=useSelector(store=>store.auth);
  const navigate=useNavigate();
  useEffect(()=>{
    if(user){
      if(user.role==="recruiter"){
        navigate("/admin/companies");

      }
    }
  },[user]);


  return (
    <div><Navbar/>
       <HeroSection/>
       <CategoryCarousel/>
       <LatestJob/>
        <Footer/>
       </div>

  )
}

export default home