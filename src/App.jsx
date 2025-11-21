import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './MainLayout'
import Home from './Home/Home'
import ProductDetail from './ProductDetails/ProductDetail'
import ScrollToTop from './ScrollToTop'
import Cart from './Cart/Cart'
import { CartProvider } from './CartContext'
import { AuthProvider } from './context/AuthContext'
import Login from './Login/Login'
import Signup from './Signup/Signup'
import ForgetPassword from './Forget/ForgetPassword'
import OTP from './OTP/OTP'
import SetPassWord from './SetPassWord/SetPassWord'
import ViewAllProducts from './Viewall/ViewAllProducts'
import CategoryPage from './Category/CategoryPage'
import Delevery from './Delevery/Delevery'
import CnforderOtp from "./Cnforderotp/Cnforderotp.jsx";
import Billing from './Billing/Billing'
import OrdSummery from './OrdSummery/OrdSummery'
import Track from './Track/Track'
import OrderHistory from './OrderHistory/OrderHistory'
import Setting from './Setting/Setting'
import Chengepassin from './Changepassin/Chengepassin'
import TermsAndConditions from './Privacy/TermsAndConditions.jsx'
import PrivacyPolicy from './Privacy/PrivacyPolicy.jsx'
import CancellationRefund from './Privacy/CancellationRefund.jsx'
import ShippingPolicy from './Privacy/ShippingPolicy.jsx'
import ContactUs from './Privacy/ContactUs.jsx'


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path='/cart' element={<Cart />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/view-all" element={<ViewAllProducts />} />
              <Route path="/delivery" element={<Delevery />} />
              <Route path='/billing' element={<Billing />} />
              <Route path='/cnforderotp' element={<CnforderOtp />} />
              <Route path='/ordsummery' element={<OrdSummery />} />
              <Route path='/track/:orderId?' element={<Track />} />
              <Route path='/orderHistory' element={<OrderHistory />} />
              <Route path='/settings' element={<Setting />} />
              <Route path='/changepassword' element={<Chengepassin />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cancellation-and-refund" element={<CancellationRefund />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/contact-us" element={<ContactUs />} />
            </Route>



            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Signup />} />
            <Route path='/forgetpassword' element={<ForgetPassword />} />
            <Route path='/otp' element={<OTP />} />
            <Route path='/setPass' element={<SetPassWord />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App