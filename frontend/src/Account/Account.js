import React from 'react';
import './Account.css'; 

const Account= () => {
    return (
      <div className="account-page">
        <aside className="sidebar">
          <div className="profile-info">
            <div className="profile-avatar"></div>
            <div className="profile-email">saira@gmail.com</div>
          </div>
          <nav className="sidebar-menu">
            <ul>
              <li className="active">Personal information</li>
              <li>Billing & Payments</li>
              <li>Order History</li>
            </ul>
          </nav>
          <button className="sign-out-btn">Sign out</button>
          <button className="delete-btn">Delete Account</button>
        </aside>
        <main className="main-content">
        <div className="header">
        <h2>Personal Information</h2>
        <button className="edit">Edit</button>
        </div>
       
        <p>Manage your personal information, including phone numbers and email addresses where you can be contacted.</p>
        <div className="info-cards">
          <div className="info-card">
            <label>Name</label>
            <p>Saira Rahman</p>
          </div>
          <div className="info-card">
            <label>Date of Birth</label>
            <p>07 July 1993</p>
          </div>
          <div className="info-card">
            <label>Country/Region</label>
            <p>Bangladesh, Dhaka</p>
          </div>
          <div className="info-card">
          <label>Language</label>
            <p>English (UK) - English</p>
          </div>
          <div className="info-card">
            <label>Contactable at</label>
            <p>ikakodesign@gmail.com</p>
          </div>
        </div>
      </main>
    </div>
  );
};


  

export default Account;
