import React, { useState, useEffect } from 'react'
import Hero from '../Hero/Hero'
import Category from '../Category/Category'
import ProductSection from '../NewLaunches/ProductSection'
import Features from '../Features/Features'
import { getProducts } from '../api/product'
import { getCategories } from '../api/category'
import Loader, { useLoadingWithDelay } from '../Loader'

function Home() {
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const showLoader = useLoadingWithDelay(loading, 1000)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        setAllProducts(productsRes?.data || [])
        setCategories(categoriesRes?.data || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get products by category for display
  const getProductsByCategoryName = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName)
    if (!category) return []
    return allProducts.filter(product => 
      product.category?._id === category._id || product.category === category._id
    )
  }

  if (showLoader) {
    return <Loader fullScreen={true} size="large" />
  }

 
  

  const newLaunches = [...allProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))


  
  
  // Get products by category
  const menProducts = getProductsByCategoryName("Men") 
  const womenProducts = getProductsByCategoryName("Women")

  return (
    <div>
        <Hero/>
        <Category/>
        {newLaunches.length > 0 && <ProductSection title="New Launches" products={newLaunches} />}
        {menProducts.length > 0 && <ProductSection title="Top Men Products" products={menProducts} />}
        {womenProducts.length > 0 && <ProductSection title="Top Women Products" products={womenProducts} />}
        <Features/>
    </div>
  )
}

export default Home