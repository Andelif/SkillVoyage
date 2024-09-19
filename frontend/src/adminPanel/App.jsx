import React, {  useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sbar from './components/Sbar/Sbar'
import { Routes,Route } from 'react-router-dom'
import AddProduct from './pages/AddProduct/AddProduct'
import ListProduct from './pages/ListProduct/ListProduct'
import AddInstructor from './pages/AddInstructor/AddInstructor'
import ListInstructor from './pages/ListInstructor/ListInstructor'
import './index.css'
import Orders from './pages/Orders/Orders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { setupInterceptors } from '../services/apiClient';

const App = () => {
  const url = "https://skill-voyage-api.vercel.app/admin"
  const navigate = useNavigate();

  // Call setupInterceptors for the admin panel
  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);


  return (
    <div>
      <ToastContainer/>
  
      <div className="app-comp">
        <Sbar/>
        <Routes>
          <Route path="add" element={<AddProduct url={url}/>}/> 
          <Route path="list" element={<ListProduct url={url}/>} /> 
          {/* <Route path="order" element={<Orders url={url} />} /> */}

          <Route path="add/instructor" element={<AddInstructor url={url} />} />
          <Route path="list/instructor" element={<ListInstructor url={url} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App