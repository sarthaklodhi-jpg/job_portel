//ye lib mai nahi hona tha isse components mai hona tha
import React from 'react'
import Navbar from '../components/shared/navbar.jsx'
import HeroSection from '../components/herosection.jsx'
import CategoryCarousel from '../components/categorycarousel.jsx'
import LatestJob from '../components/latestjob.jsx'
import Footer from '@/components/shared/footer.jsx'
import useGetAllJobs from '../hook/usegetalljobs.jsx'

const home = () => {
  useGetAllJobs();
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