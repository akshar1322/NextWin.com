
import React from 'react'
import Homepage from '../home/page'
import Navbar from './components/Ui/Navbar'
import Footer from './components/Ui/Footer'


const page = () => {
  return (
    <>
      <main className=' bg-[#EEEEEE]  overflow-hidden ' >
        <Navbar/>
        <Homepage/>
        <Footer/>
      </main>
    </>
  )
}

export default page
