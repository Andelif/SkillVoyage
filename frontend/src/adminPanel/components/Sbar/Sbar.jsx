import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import './Sbar.css';
import { NavLink } from 'react-router-dom';

const Sbar = () => {
  const [showOptions, setShowOptions] = useState(null);
  const [selectedOption, setSelectedOption] = useState(''); // Track selected option

  const handleOptionClick = (option) => {
    setShowOptions(option);
    setSelectedOption(option); // Update the selected option
  };

  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        {/* Add Items */}
        <div 
          className={`sidebar-opt ${selectedOption === 'add' ? 'selected' : ''}`}
          onClick={() => handleOptionClick('add')}
        >
          <img src={assets.add_icon} alt="" />
          <p>Add</p>
        </div>

        {/* List Items */}
        <div 
          className={`sidebar-opt ${selectedOption === 'list' ? 'selected' : ''}`} 
          onClick={() => handleOptionClick('list')}
        >
          <img src={assets.list_icon} alt="" />
          <p>List</p>
        </div>

        
        

        {/* Conditionally render Add options */}
        {showOptions === 'add' && (
          <div className="sidebar-options">
            <NavLink to='/admin/add' className="sidebar-opt">
              <p>Course</p>
            </NavLink>
            <NavLink to='/admin/add/instructor' className="sidebar-opt">
              <p>Instructor</p>
            </NavLink>
          </div>
        )}

        {/* Conditionally render List options */}
        {showOptions === 'list' && (
          <div className="sidebar-options">
            <NavLink to='/admin/list' className="sidebar-opt">
              <p>Course</p>
            </NavLink>
            <NavLink to='/admin/list/instructor' className="sidebar-opt">
              <p>Instructor</p>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sbar;
