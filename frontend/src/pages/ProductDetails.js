import React, { useCallback, useContext, useEffect, useState } from 'react'
import  { useNavigate, useParams } from 'react-router-dom'
import SummaryApi from '../common'
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import displayINRCurrency from '../helpers/displayCurrency';
import VerticalCardProduct from '../components/VerticalCardProduct';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import { toast } from 'react-toastify' 

const ProductDetails = () => {
  const [data,setData] = useState({
    productName : "",
    brandName : "",
    category : "",
    productImage : [],
    description : "",
    price : "",
    sellingPrice : "",
    sizes: [] 
  })
  const params = useParams()
  const [loading,setLoading] = useState(true)
  const productImageListLoading = new Array(4).fill(null)
  const [activeImage,setActiveImage] = useState("")

  const [zoomImageCoordinate,setZoomImageCoordinate] = useState({
    x : 0,
    y : 0
  })
  const [zoomImage,setZoomImage] = useState(false)
  const [selectedSize, setSelectedSize] = useState("") 

  const { fetchUserAddToCart } = useContext(Context)
  const navigate = useNavigate()

  const fetchProductDetails = async()=>{
    setLoading(true)
    const response = await fetch(SummaryApi.productDetails.url,{
      method : SummaryApi.productDetails.method,
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify({
        productId : params?.id
      })
    })
    setLoading(false)
    const dataReponse = await response.json()

    setData(dataReponse?.data)
    setActiveImage(dataReponse?.data?.productImage[0])
    setSelectedSize("") 
  }

  useEffect(()=>{
    fetchProductDetails()
  },[params])

  const handleMouseEnterProduct = (imageURL)=>{
    setActiveImage(imageURL)
  }

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true)
    const { left , top, width , height } = e.target.getBoundingClientRect()

    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height

    setZoomImageCoordinate({
      x,
      y
    })
  }, [zoomImageCoordinate])

  const handleLeaveImageZoom = ()=>{
    setZoomImage(false)
  }

  // 🌟 EXPANDED SIZE VALIDATION: Checks shoes, clothes, jerseys, or custom items
  const isSizeRequiredButMissing = () => {
    const currentCategory = (data?.category || "").toLowerCase().trim();
    const hasSizesAvailable = Array.isArray(data?.sizes) && data.sizes.length > 0;
    
    const sizeIsMandatory = 
      currentCategory === "shoes" || 
      currentCategory === "clothes" || 
      currentCategory === "jerseys" || 
      hasSizesAvailable;

    return sizeIsMandatory && !selectedSize;
  };

  // Helper helper to get dynamic notification labels
  const getCategoryLabel = () => {
    const category = (data?.category || "").toLowerCase().trim();
    if (category === "shoes") return "shoe size";
    if (category === "jerseys") return "jersey size";
    return "size";
  };

  // 🌟 AIRTIGHT CART HANDLER
  const handleAddToCart = async(e, id) => {
    e?.stopPropagation();
    e?.preventDefault();

    if(isSizeRequiredButMissing()){
      toast.error(`Please choose a ${getCategoryLabel()} before adding to cart!`, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored"
      });
      return; // 🛑 Stops execution completely
    }
    
    await addToCart(e, id, selectedSize)
    fetchUserAddToCart()
  }

  // 🌟 AIRTIGHT BUY HANDLER
  const handleBuyProduct = async(e, id) => {
    e?.stopPropagation();
    e?.preventDefault();

    if(isSizeRequiredButMissing()){
      toast.error(`Please choose a ${getCategoryLabel()} before making an order!`, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored"
      });
      return; // 🛑 Stops execution completely
    }
    
    await addToCart(e, id, selectedSize)
    fetchUserAddToCart()
    navigate("/cart")
  }

  const isSizingMissing = isSizeRequiredButMissing();

  return (
    <div className='container mx-auto p-4'>

      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>
          {/***product Image */}
          <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>

              <div className='h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative p-2'>
                  <img src={activeImage} className='h-full w-full object-scale-down mix-blend-multiply' onMouseMove={handleZoomImage} onMouseLeave={handleLeaveImageZoom}/>

                    {/**product zoom */}
                    {
                      zoomImage && (
                        <div className='hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-200 p-1 -right-[510px] top-0'>
                          <div
                            className='w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150'
                            style={{
                              background : `url(${activeImage})`,
                              backgroundRepeat : 'no-repeat',
                              backgroundPosition : `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}% `
                            }}
                          >
                          </div>
                        </div>
                      )
                    }
              </div>

              <div className='h-full'>
                  {
                    loading ? (
                      <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                        {
                          productImageListLoading.map((el,index) =>{
                            return(
                              <div className='h-20 w-20 bg-slate-200 rounded animate-pulse' key={"loadingImage"+index}>
                              </div>
                            )
                          })
                        }
                      </div>
                    ) : (
                      <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                        {
                          data?.productImage?.map((imgURL,index) => {
                            return(
                              <div className='h-20 w-20 bg-slate-200 rounded p-1' key={imgURL}>
                                <img src={imgURL} className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' onMouseEnter={()=>handleMouseEnterProduct(imgURL)}  onClick={()=>handleMouseEnterProduct(imgURL)}/>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  }
              </div>
          </div>

           {/***product details */}
           {
            loading ? (
              <div className='grid gap-1 w-full'>
                <p className='bg-slate-200 animate-pulse  h-6 lg:h-8 w-full rounded-full inline-block'></p>
                <h2 className='text-2xl lg:text-4xl font-medium h-6 lg:h-8   bg-slate-200 animate-pulse w-full'></h2>
                <p className='capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8  w-full'></p>

                <div className='text-red-600 bg-slate-200 h-6 lg:h-8  animate-pulse flex items-center gap-1 w-full'></div>

                <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8  animate-pulse w-full'>
                  <p className='text-red-600 bg-slate-200 w-full'></p>
                  <p className='text-slate-400 line-through bg-slate-200 w-full'></p>
                </div>

                <div className='flex items-center gap-3 my-2 w-full'>
                  <button className='h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full'></button>
                  <button className='h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full'></button>
                </div>

                <div className='w-full'>
                  <p className='text-slate-600 font-medium my-1 h-6 lg:h-8   bg-slate-200 rounded animate-pulse w-full'></p>
                  <p className=' bg-slate-200 rounded animate-pulse h-10 lg:h-12  w-full'></p>
                </div>
              </div>
            ) : 
            (
              <div className='flex flex-col gap-1'>
                <p className='bg-red-200 text-red-600 px-2 rounded-full inline-block w-fit'>{data?.brandName}</p>
                <h2 className='text-2xl lg:text-4xl font-medium'>{data?.productName}</h2>
                <p className='capitalize text-slate-400'>{data?.category}</p>

                <div className='text-red-600 flex items-center gap-1'>
                    <FaStar/><FaStar/><FaStar/><FaStar/><FaStarHalf/>
                </div>

                <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1'>
                  <p className='text-red-600'>{displayINRCurrency(data.sellingPrice)}</p>
                  <p className='text-slate-400 line-through'>{displayINRCurrency(data.price)}</p>
                </div>

                {/* 🌟 DYNAMIC SIZE SELECTOR INTERFACE */}
                {
                  (data?.category?.toLowerCase() === "shoes" || 
                   data?.category?.toLowerCase() === "clothes" || 
                   data?.category?.toLowerCase() === "jerseys" || 
                   (data?.sizes && data?.sizes?.length > 0)) && (
                    <div className='my-3'>
                      <p className='text-slate-700 font-medium mb-2'>
                        {data?.category?.toLowerCase() === "shoes" ? "Select Shoe Size:" : 
                         data?.category?.toLowerCase() === "jerseys" ? "Select Jersey Size:" : "Select Size:"}
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        {
                          (data?.sizes && data?.sizes?.length > 0 
                            ? data.sizes 
                            : data?.category?.toLowerCase() === "shoes"
                              ? ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"]
                              : ["S", "M", "L", "XL", "XXL"]
                          ).map((size) => (
                            <button
                              type='button'
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-3 h-10 min-w-[40px] flex items-center justify-center text-sm font-semibold border rounded transition-all ${
                                selectedSize === size
                                  ? 'border-red-600 bg-red-600 text-white shadow-sm'
                                  : 'border-slate-300 bg-white text-slate-800 hover:border-slate-800'
                              }`}
                            >
                              {size}
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  )
                }

                {/* ACTION BUTTONS */}
                <div className='flex items-center gap-3 my-2'>
                  <button 
                    type='button'
                    disabled={isSizingMissing}
                    className={`border-2 rounded px-3 py-1 min-w-[120px] font-medium transition-all duration-200 ${
                      isSizingMissing 
                        ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer'
                    }`} 
                    onClick={(e)=>handleBuyProduct(e,data?._id)}
                  >
                    Buy
                  </button>
                  <button 
                    type='button'
                    disabled={isSizingMissing}
                    className={`border-2 rounded px-3 py-1 min-w-[120px] font-medium transition-all duration-200 ${
                      isSizingMissing 
                        ? 'border-slate-200 bg-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'border-red-600 text-white bg-red-600 hover:text-red-600 hover:bg-white cursor-pointer'
                    }`} 
                    onClick={(e)=>handleAddToCart(e,data?._id)}
                  >
                    Add To Cart
                  </button>
                </div>

                <div>
                  <p className='text-slate-600 font-medium my-1'>Description : </p>
                  <p>{data?.description}</p>
                </div>
              </div>
            )
           }

      </div>

      {
        data.category && (
          <CategroyWiseProductDisplay category={data?.category} heading={"Recommended Product"}/>
        )
      }
      
    </div>
  )
}

export default ProductDetails