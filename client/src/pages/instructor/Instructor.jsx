import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../../components/instructor/Sidebar'
import Navbar from '../../components/instructor/Navbar'
import Footer from '../../components/instructor/Footer'

const Instructor = () => {
    return (
        <div className="text-default min-h-screen bg-white">
            <Navbar />
            <div className='flex'>
                <SideBar />
                <div className='flex-1'>
                    {<Outlet />}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Instructor