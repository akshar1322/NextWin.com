
import React from 'react'
import HeroBanner from '../app/components/Elements/sliders/BannerSlider'
import BestSeller from '../app/components/cards/Best-Seller'
import ShopByCategory from '@/app/components/Elements/ShopByCategory'
import InstagramSection from '@/app/components/Ui/ig'

const Homepage = () => {
  return (
    <>
    <main className=' bg-[#EEEEEE] p-4 md:p-3 lg:p-2 overflow-hidden '>

        <HeroBanner/>
        <div className='py-10'>
            <BestSeller/>
            <ShopByCategory/>
            <InstagramSection/>
        </div>


    </main>
    </>
  )
}

export default Homepage
