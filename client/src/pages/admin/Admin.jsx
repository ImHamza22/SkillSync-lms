import React, { useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import Navbar from '../../components/admin/Navbar'
import Sidebar from '../../components/admin/Sidebar'
import Footer from '../../components/instructor/Footer'
import Loading from '../../components/student/Loading'

const Admin = () => {
  const { isAdmin, navigate } = useContext(AppContext)
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && (!user || !isAdmin)) {
      navigate('/')
    }
  }, [isLoaded, user, isAdmin])

  if (!isLoaded) return <Loading />
  if (!user || !isAdmin) return null

  return (
    <div className="text-default min-h-screen bg-white">
      <Navbar />
      <div className='flex'>
        <Sidebar />
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Admin
