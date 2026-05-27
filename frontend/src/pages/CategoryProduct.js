import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import VerticalCard from '../components/VerticalCard'
import SummaryApi from '../common'

const CategoryProduct = () => {
    const [data, setData] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    
    // Parse URL values into an initial state object smoothly
    const getInitialCategories = () => {
      const urlSearch = new URLSearchParams(location.search)
      const urlCategoryListinArray = urlSearch.getAll("category")
      const urlCategoryListObject = {}
      urlCategoryListinArray.forEach(el => {
        urlCategoryListObject[el] = true
      })
      return urlCategoryListObject
    }

    const [selectCategory, setSelectCategory] = useState(getInitialCategories())
    const [filterCategoryList, setFilterCategoryList] = useState([])
    const [sortBy, setSortBy] = useState("")

    // Sync state if the user navigates directly to a link from another page (e.g. Home Page)
    useEffect(() => {
      setSelectCategory(getInitialCategories())
    }, [location.search])

    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(SummaryApi.filterProduct.url, {
          method: SummaryApi.filterProduct.method,
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            category: filterCategoryList
          })
        })

        const dataResponse = await response.json()
        let resultData = dataResponse?.data || []

        // Apply sorting to incoming backend data if sort parameters are set
        if (sortBy === 'asc') {
          resultData.sort((a, b) => a.sellingPrice - b.sellingPrice)
        } else if (sortBy === 'dsc') {
          resultData.sort((a, b) => b.sellingPrice - a.sellingPrice)
        }

        setData(resultData)
      } catch (error) {
        console.error("Error filtering products:", error)
      } finally {
        setLoading(false)
      }
    }

    const handleSelectCategory = (e) => {
      const { value, checked } = e.target

      setSelectCategory((preve) => {
        return {
          ...preve,
          [value]: checked
        }
      })
    }

    useEffect(() => {
      fetchData()
    }, [filterCategoryList, sortBy]) // Re-run fetch whenever active filters or sort methods change

    useEffect(() => {
      const arrayOfCategory = Object.keys(selectCategory).map(categoryKeyName => {
        if (selectCategory[categoryKeyName]) {
          return categoryKeyName
        }
        return null
      }).filter(el => el)

      setFilterCategoryList(arrayOfCategory)

      // FIX: Clean, standard URL construction using URLSearchParams instead of manual strings
      const params = new URLSearchParams()
      arrayOfCategory.forEach(category => {
        params.append("category", category)
      })
      
      const searchString = params.toString()
      navigate(searchString ? `/product-category?${searchString}` : `/product-category`)

    }, [selectCategory])

    const handleOnChangeSortBy = (e) => {
      const { value } = e.target
      setSortBy(value)
    }

  return (
    <div className='container mx-auto p-4'>

       {/***desktop version */}
       <div className='hidden lg:grid grid-cols-[200px,1fr]'>
           {/***left side */}
           <div className='bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll'>
                {/**sort by */}
                <div className=''>
                    <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>

                    <form className='text-sm flex flex-col gap-2 py-2'>
                        <div className='flex items-center gap-3'>
                          <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value={"asc"}/>
                          <label>Price - Low to High</label>
                        </div>

                        <div className='flex items-center gap-3'>
                          <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value={"dsc"}/>
                          <label>Price - High to Low</label>
                        </div>
                    </form>
                </div>

                {/**filter by */}
                <div className='mt-4'>
                    <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>

                    <form className='text-sm flex flex-col gap-2 py-2'>
                        {
                          productCategory.map((categoryName, index) => {
                            return (
                              <div className='flex items-center gap-3' key={categoryName?.value + index}>
                                 <input 
                                   type='checkbox' 
                                   name={"category"} 
                                   checked={!!selectCategory[categoryName?.value]} 
                                   value={categoryName?.value} 
                                   id={categoryName?.value} 
                                   onChange={handleSelectCategory} 
                                 />
                                 <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                              </div>
                            )
                          })
                        }
                    </form>
                </div>
           </div>

            {/***right side ( product ) */}
            <div className='px-4'>
              <p className='font-medium text-slate-800 text-lg my-2'>Search Results : {data.length}</p>

             <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
              {
                  loading ? (
                    <p className='text-center text-lg text-slate-500 mt-10'>Loading Products...</p>
                  ) : data.length !== 0 ? (
                    <VerticalCard data={data} loading={loading}/>
                  ) : (
                    <p className='text-center text-lg text-slate-500 mt-10'>No Products Found Match This Selection.</p>
                  )
              }
             </div>
            </div>
       </div>
    </div>
  )
}

export default CategoryProduct