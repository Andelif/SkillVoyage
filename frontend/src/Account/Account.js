import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Account.css";
import { toast } from "react-toastify";
import logout from '../Home page/Navbar'
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const navigate = useNavigate();
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
      reader.onload = () => resolve(reader.result.split(",")[1]);
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
        const response = await axios.post(
          "https://skill-voyage-api.vercel.app/api/user/update-image",
          {
            email: user.email,
            image: imageBase64,
          }
        );

        if (response.data.success) {
          console.log("Image successfully updated in the database");
          toast.success("Image uploaded successfully");
          window.location.reload();
        } else {
          console.error(
            "Error updating image in the database:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleRemoveImage = async () => {
    try {
      // Send request to remove the image from the backend
      const response = await axios.post(
        "https://skill-voyage-api.vercel.app/api/user/remove-image",
        { email: user.email }
      );

      if (response.data.success) {
        // Remove image from frontend state and localStorage
        setUser((prevUser) => ({
          ...prevUser,
          image: "",
        }));
        const updatedUser = { ...user, image: "" };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.location.reload();
        toast.success("Image removed successfully");
      } else {
        console.error("Error removing image:", response.data.message);
      }
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.post(
        "https://skill-voyage-api.vercel.app/api/user/delete-account",
        { email: user.email }
      );

      if (response.data.success) {
        // Clear local storage and log the user out
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem('isAdmin');
        toast.success("Account deleted successfully");

        
        navigate("/login");
      } else {
        console.error("Error deleting account else:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  

  return (
    <div className="account-page">
      <aside className="sidebar">
        <div className="profile-info">
          <div className="profile-avatar">
            {user.image ? (
              <>

                <img
                  className="profile-avatar"
                  src={`data:image/jpeg;base64,${user.image}`}
                  alt="Profile"
                />
              </>
            ) : (
              <>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleUpload}
                className="file-input"
              />
              <button
                className="file-upload-button" onClick={() => document.getElementById("fileInput").click()}
              >
                Upload Image
              </button>
              </>
            )}
          </div>
          <div className="profile-email">{user.email}</div>

          {user.image ? (
            <div className="custom-file-upload">
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleUpload}
                className="file-input"
              />
              <button
                className="file-input-button" onClick={() => document.getElementById("fileInput").click()}
              >
                Change Image
              </button>

              <button className="remove-image-btn" onClick={handleRemoveImage}>
                Remove Image
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
        <nav className="sidebar-menu">
          {/* <ul>
            <li className="active">Personal information</li>
            <li>Billing & Payments</li>
            <li>Order History</li>
          </ul> */}
        </nav>
        
        <button className="delete-btn" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </aside>
      <main className="main-content">
        <div className="header">
          <h2>Personal Information</h2>
          
        </div>
        <p>
          Manage your personal information.
        </p>
        <div className="info-cards">
          <div className="info-card">
            <label>Name</label>

            <p>{user.name}</p>
          </div>

          <div className="info-card">
            <label>Contactable at</label>

            <p>{user.email}</p>
          </div>

          <div className="info-card">
            <label>Country/Region</label>
            <p>Bangladesh, Dhaka</p>
          </div>

          {/* Add other info cards as needed */}
        </div>
      </main>
    </div>
  );
};

export default Account;
