
import React from 'react'
import HeroBanner from '../app/components/Elements/sliders/BannerSlider'
import BestSeller from '../app/components/cards/Best-Seller'

const Homepage = () => {
  return (
    <>
    <main className=' bg-[#EEEEEE] p-4 md:p-3 lg:p-2 overflow-hidden '>

        <HeroBanner/>
        <div className='py-10'> 
            <BestSeller/>
        </div>

    </main>
    </>
  )
}

export default Homepage
