import React from 'react'
import { assets } from '../../assets/assets'
import './Sbar.css'
import { NavLink } from 'react-router-dom'

const Sbar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/admin/add' className="sidebar-opt">
            <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
        </NavLink>
        <NavLink to='/admin/list' className="sidebar-opt">
            <img src={assets.list_icon} alt="" />
            <p>List Items</p>
        </NavLink>
        <NavLink to='/admin/order' className="sidebar-opt">
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
        </NavLink>
    </div>
   </div> 
  )
}

export default Sbar
