import React, { useEffect, useState } from 'react'
// Removed image1 entirely
import image2 from '../assest/banner/img2.webp'
import image3 from '../assest/banner/img3.jpg'
import image4 from '../assest/banner/img4.jpg'
import image5 from '../assest/banner/img5.webp'

// Removed image1Mobile entirely
import image2Mobile from '../assest/banner/img2_mobile.webp'
import image3Mobile from '../assest/banner/img3_mobile.jpg'
import image4Mobile from '../assest/banner/img4_mobile.jpg'
import image5Mobile from '../assest/banner/img5_mobile.png'

import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

const BannerProduct = () => {
    const [currentImage, setCurrentImage] = useState(0)

    // Now contains 4 images instead of 5
    const desktopImages = [
        image2,
        image3,
        image4,
        image5
    ]

    // Now contains 4 images instead of 5
    const mobileImages = [
        image2Mobile,
        image3Mobile,
        image4Mobile,
        image5Mobile
    ]

    const nextImage = () => {
        if (desktopImages.length - 1 > currentImage) {
            setCurrentImage(prev => prev + 1)
        }
    }

    const preveImage = () => {
        if (currentImage !== 0) {
            setCurrentImage(prev => prev - 1)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage(prev => {
                if (desktopImages.length - 1 > prev) {
                    return prev + 1
                } else {
                    return 0
                }
            })
        }, 5000)

        return () => clearInterval(interval)
    }, [desktopImages.length])

    return (
        <div className='container mx-auto px-4 rounded '>
            <div className='h-56 md:h-72 w-full bg-slate-200 relative'>

                <div className='absolute z-10 h-full w-full md:flex items-center hidden '>
                    <div className=' flex justify-between w-full text-2xl'>
                        <button onClick={preveImage} className='bg-white shadow-md rounded-full p-1'><FaAngleLeft /></button>
                        <button onClick={nextImage} className='bg-white shadow-md rounded-full p-1'><FaAngleRight /></button> 
                    </div>
                </div>

                {/**desktop and tablet version */}
                <div className='hidden md:flex h-full w-full overflow-hidden'>
                    {
                        desktopImages.map((imageURl, index) => {
                            return (
                                <div className='w-full h-full min-w-full min-h-full transition-all' key={imageURl} style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                                    <img src={imageURl} className='w-full h-full' alt={`Store Banner Desktop ${index + 1}`} />
                                </div>
                            )
                        })
                    }
                </div>

                {/**mobile version */}
                <div className='flex h-full w-full overflow-hidden md:hidden'>
                    {
                        mobileImages.map((imageURl, index) => {
                            return (
                                <div className='w-full h-full min-w-full min-h-full transition-all' key={imageURl} style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                                    <img src={imageURl} className='w-full h-full object-cover' alt={`Store Banner Mobile ${index + 1}`} />
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export default BannerProduct
