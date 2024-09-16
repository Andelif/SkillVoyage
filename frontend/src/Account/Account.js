import React, { useState, useEffect } from "react";
import axios from 'axios'
import "./Account.css";

const Account = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    // Retrieve user info from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        name: storedUser.name,
        email: storedUser.email,
        image: storedUser.image || "", // Default to empty string if no image is available
      });
    }
  }, []);

   // Function to convert image file to base64
   const imageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageBase64 = await imageToBase64(file);

      // Update user state in frontend
      setUser((prevUser) => ({
        ...prevUser,
        image: imageBase64,
      }));

      // Update user image in localStorage
      const updatedUser = { ...user, image: imageBase64 };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Send the base64 image to backend for storage in MongoDB
      try {
        const response = await axios.post('https://skill-voyage-api.vercel.app/api/user/update-image', {
          email: user.email,
          image: imageBase64,
        });

        if (response.data.success) {
          console.log('Image successfully updated in the database');
        } else {
          console.error('Error updating image in the database:', response.data.message);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };



  return (
    <div className="account-page">
      <aside className="sidebar">
        <div className="profile-info">
          <div className="profile-avatar">
            {user.image ? (
              <img className="profile-avatar" src={`data:image/jpeg;base64,${user.image}`} alt="Profile" />
            ) : (
              <>
                
                <input
  
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="upload-input"
                  />
              </>
            )}
          </div>
          <div className="profile-email">{user.email}</div>
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
        <p>
          Manage your personal information, including phone numbers and email
          addresses where you can be contacted.
        </p>
        <div className="info-cards">
          <div className="info-card">
            <label>Name</label>
            <br></br>
            <p>{user.name}</p>
          </div>

          <div className="info-card">
            <label>Contactable at</label>
            <br></br>
            <p>{user.email}</p>
          </div>

          {/* Add other info cards as needed */}
        </div>
      </main>
    </div>
  );
};

export default Account;
