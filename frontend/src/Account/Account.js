import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Account.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        name: storedUser.name,
        email: storedUser.email,
        image: storedUser.image || "",
      });
      setNewName(storedUser.name);
      setNewEmail(storedUser.email);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Function to convert image file to base64
  const imageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSave = async () => {
    setLoading1(true);
    const updatedUser = { name: newName, email: newEmail, image: user.image };

    // Check if the email has changed, and if so, check if it exists in the database
    if (newEmail !== user.email) {
      try {
        const response = await axios.post(
          "https://skill-voyage-api.vercel.app/api/user/check-email",
          {
            email: newEmail,
          }
        );

        if (!response.data.success) {
          toast.error("User with that email already exists");
          setLoading1(false);
          return;
        }
      } catch (error) {
        console.error("Error checking email:", error);
        setLoading1(false);
        setErrorMessage("An error occurred while checking the email.");
        return;
      }
    }

    // Update user information in the database
    try {
      const response = await axios.post(
        "https://skill-voyage-api.vercel.app/api/user/update",
        {
          currentEmail: user.email, // Send the current email so the server knows who to update
          newName,
          newEmail,
        }
      );

      if (response.data.success) {
        // Update frontend state and localStorage with the new information
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message || "Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("An error occurred while updating the profile.");
    } finally {
      setLoading1(false);
    }
  };

  // Handle image upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
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
          toast.success(response.data.success);
          window.location.reload();
        } else {
          console.error(
            "Error updating image in the database:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveImage = async () => {
    setLoading(true);
    try {
      // Send request to remove the image from the backend
      const response = await axios.post(
        "https://skill-voyage-api.vercel.app/api/user/remove-image",
        { email: user.email }
      );

      if (response.data.success) {
        setLoading(false);
        // Remove image from frontend state and localStorage
        setUser((prevUser) => ({
          ...prevUser,
          image: "",
        }));
        const updatedUser = { ...user, image: "" };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success(response.data.success);
        window.location.reload();
      } else {
        console.error("Error removing image:", response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error removing image:", error);
      setLoading(false);
    }
  };

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://skill-voyage-api.vercel.app/api/user/delete-account",
        { email: user.email }
      );

      if (response.data.success) {
        // Clear local storage and log the user out
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("isAdmin");
        toast.success("Account deleted successfully");

        navigate("/home");
      } else {
        console.error("Error deleting account else:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      <aside className="sidebar">
        {loading ? (
          <Loader />
        ) : (
          <>
            {" "}
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
                      className="file-upload-button"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
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
                    className="file-input-button"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    Change Image
                  </button>

                  <button
                    className="remove-image-btn"
                    onClick={handleRemoveImage}
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
            <button className="delete-btn" onClick={handleDeleteAccount}>
              Delete Account
            </button>{" "}
          </>
        )}
      </aside>

      <main className="main-content">
        {loading1?(
          <Loader />
          ):(
            <>
            <div className="header">
          <h2>Personal Information</h2>
          {isEditing ? (
            <button className="save" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="edit" onClick={handleEdit}>
              Edit
            </button>
          )}
        </div>
        <p>Manage your personal information.</p>
        <div className="info-cards">
          <div className="info-card">
            <label>Name</label>

            {isEditing ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            ) : (
              <p>{user.name}</p>
            )}
          </div>

          <div className="info-card">
            <label>Contactable at</label>

            {isEditing ? (
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            ) : (
              <p>{user.email}</p>
            )}
          </div>

          <div className="info-card">
            <label>Country/Region</label>
            <p>Bangladesh, Dhaka</p>
          </div>
        </div>

            </>

          )}

        
      </main>







    </div>
  );
};

export default Account;
