import React from 'react'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import { Outlet } from 'react-router-dom'
import CategoryBar from './Categorybar/CategoryBar'

function MainLayout() {
  return (
    <>
         <Header/>
      <CategoryBar/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default MainLayout