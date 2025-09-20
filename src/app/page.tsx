
import React from 'react'
import Homepage from '../home/page'
import Navbar from './components/Ui/Navbar'
import Footer from './components/Ui/Footer'


const page = () => {
  return (
    <>
      <main className=' bg-[#EEEEEE]  overflow-hidden ' >
        <Navbar/>
        <div className=' mt-6 sm:mt-14 lg:mt-16' >
          <Homepage/>
        </div>
        <Footer/>
      </main>
    </>
  )
}

export default page
