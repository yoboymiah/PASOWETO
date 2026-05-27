import React, { useState } from 'react'
import { CgClose } from "react-icons/cg";
import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify'

const UploadProduct = ({
  onClose,
  fetchData
}) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
    sizes: [] 
  })
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false)
  const [fullScreenImage, setFullScreenImage] = useState("")

  // 🌟 DYNAMIC SIZE MAPPER CONFIGURATION
  const sizeOptionsConfig = {
    shoes: {
      label: "Select Shoe Sizes :",
      options: ["38", "39", "40", "41", "42", "43", "44", "45"]
    },
    clothes: {
      label: "Select Clothing Sizes :",
      options: ["S", "M", "L", "XL", "XXL", "3XL"]
    },
    jerseys: {
      label: "Select Jersey Sizes :",
      options: ["S", "M", "L", "XL", "XXL"]
    }
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
        // Reset sizes array clean if switching between completely different product groups
        ...(name === "category" ? { sizes: [] } : {})
      }
    })
  }

  const handleSizeChange = (size) => {
    setData((preve) => {
      const isSizeSelected = preve.sizes.includes(size);
      let updatedSizes;

      if (isSizeSelected) {
        updatedSizes = preve.sizes.filter(s => s !== size);
      } else {
        updatedSizes = [...preve.sizes, size];
      }

      return {
        ...preve,
        sizes: updatedSizes
      }
    })
  }

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0]
    const uploadImageCloudinary = await uploadImage(file)

    setData((preve) => {
      return {
        ...preve,
        productImage: [...preve.productImage, uploadImageCloudinary.url]
      }
    })
  }

  const handleDeleteProductImage = async (index) => {
    const newProductImage = [...data.productImage]
    newProductImage.splice(index, 1)

    setData((preve) => {
      return {
        ...preve,
        productImage: [...newProductImage]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    })

    const responseData = await response.json()

    if (responseData.success) {
      toast.success(responseData?.message)
      onClose()
      fetchData()
    }

    if (responseData.error) {
      toast.error(responseData?.message)
    }
  }

  const currentCategoryKey = data.category?.toLowerCase()?.trim();
  const activeSizingConfig = sizeOptionsConfig[currentCategoryKey];

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50'>
      <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden flex flex-col'>

        <div className='flex justify-between items-center pb-3 border-b'>
          <h2 className='font-bold text-lg'>Upload Product</h2>
          <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose />
          </div>
        </div>

        <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5 flex-1' onSubmit={handleSubmit}>
          <label htmlFor='productName'>Product Name :</label>
          <input
            type='text'
            id='productName'
            placeholder='enter product name'
            name='productName'
            value={data.productName}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='brandName' className='mt-3'>Brand Name :</label>
          <input
            type='text'
            id='brandName'
            placeholder='enter brand name'
            value={data.brandName}
            name='brandName'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='category' className='mt-3'>Category :</label>
          <select required value={data.category} name='category' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
            <option value={""}>Select Category</option>
            {
              productCategory.map((el, index) => {
                return (
                  <option value={el.value} key={el.value + index}>{el.label}</option>
                )
              })
            }
          </select>

          {/* 🌟 CONDITIONAL MULTI-SIZE GENERATOR INTERFACE FOR SHOES, CLOTHES, & JERSEYS */}
          {
            activeSizingConfig && (
              <div className='mt-3 p-3 bg-slate-50 border rounded border-dashed border-slate-300 animate-fadeIn'>
                <label className='font-medium text-slate-800'>{activeSizingConfig.label}</label>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {
                    activeSizingConfig.options.map((size) => {
                      const isSelected = data.sizes.includes(size);
                      return (
                        <button
                          type='button'
                          key={size}
                          onClick={() => handleSizeChange(size)}
                          className={`px-3 py-1 border rounded text-sm font-semibold transition-all duration-150 min-w-[42px] ${
                            isSelected 
                              ? 'bg-red-600 text-white border-red-600 shadow-sm' 
                              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          {size}
                        </button>
                      )
                    })
                  }
                </div>
              </div>
            )
          }

          <label htmlFor='productImage' className='mt-3'>Product Image :</label>
          <label htmlFor='uploadImageInput'>
            <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
              <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                <span className='text-4xl'><FaCloudUploadAlt /></span>
                <p className='text-sm'>Upload Product Image</p>
                <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} />
              </div>
            </div>
          </label>
          <div>
            {
              data?.productImage[0] ? (
                <div className='flex items-center gap-2 flex-wrap'>
                  {
                    data.productImage.map((el, index) => {
                      return (
                        <div className='relative group' key={index}>
                          <img
                            src={el}
                            alt={el}
                            width={80}
                            height={80}
                            className='bg-slate-100 border cursor-pointer object-scale-down h-20 w-20'
                            onClick={() => {
                              setOpenFullScreenImage(true)
                              setFullScreenImage(el)
                            }} />

                          <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' onClick={() => handleDeleteProductImage(index)}>
                            <MdDelete />
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              ) : (
                <p className='text-red-600 text-xs'>*Please upload product image</p>
              )
            }
          </div>

          <label htmlFor='price' className='mt-3'>Price :</label>
          <input
            type='number'
            id='price'
            placeholder='enter price'
            value={data.price}
            name='price'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='sellingPrice' className='mt-3'>Selling Price :</label>
          <input
            type='number'
            id='sellingPrice'
            placeholder='enter selling price'
            value={data.sellingPrice}
            name='sellingPrice'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='description' className='mt-3'>Description :</label>
          <textarea
            className='h-28 bg-slate-100 border resize-none p-1'
            placeholder='enter product description'
            rows={3}
            onChange={handleOnChange}
            name='description'
            value={data.description}
          >
          </textarea>

          <button className='px-3 py-2 bg-red-600 text-white mt-4 mb-10 hover:bg-red-700 font-medium transition-all'>Upload Product</button>
        </form>

      </div>

      {/***display image full screen */}
      {
        openFullScreenImage && (
          <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
        )
      }
    </div>
  )
}

export default UploadProduct