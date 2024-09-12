import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sbar from './components/Sbar/Sbar'
import { Routes,Route } from 'react-router-dom'
import AddProduct from './pages/AddProduct/AddProduct'
import ListProduct from './pages/ListProduct/ListProduct'
import Orders from './pages/Orders/Orders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const url = "http://localhost:4000"
  return (
    <div>
      <ToastContainer/>
      < Navbar />
      <div className="app-comp">
        <Sbar/>
        <Routes>
          <Route path="/add" element={<AddProduct url={url}/>}/>
          <Route path="/list" element={<ListProduct url={url}/>} />
          <Route path="/order" element={<Orders url={url} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App