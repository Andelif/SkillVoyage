import React, { useState } from "react";
import "./AddProduct.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { apiClient } from "../../../services/apiClient";

const imageToBase64 = (files) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const AddProduct = () => {
  //const url = "https://skill-voyage-api.vercel.app/api/course/add";
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    rating: "",
    image: "",
    teacher: "",
    duration: "",
    youtubeLink: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const imagePic = await imageToBase64(file);
    setData((prev) => {
      return {
        ...prev,
        image: imagePic,
      };
    });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    if (!data.image) {
      toast.error("Please upload an image.");
      return;
    }
    const courseData = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      rating: Number(data.rating),
      teacher: data.teacher,
      duration: Number(data.duration),
      image: data.image,
      youtubeLink: data.youtubeLink || null,
    };

    try {
      const response = await apiClient.post("/course/add", courseData, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Attach token here
          "Content-Type": "application/json",
        },
      });
      //When form submitted then remove the form info
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          rating: "",
          teacher: "",
          duration: "",
          image: "",
          youtubeLink: "",
        });
        setImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while adding the product.");
      console.log(error);
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img flex-col">
          <p>Upload image</p>
          <label htmlFor="image">
            <img
              src={data.image || assets.upload_area}
              alt=""
              className="img"
            />
          </label>
          <input
            onChange={handleUpload}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Course Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Course Teacher</p>
          <input
            onChange={onChangeHandler}
            value={data.teacher}
            type="text"
            name="teacher"
            placeholder="Type here"
          />
        </div>

        <div className="add-product-desc flex-col">
          <p>Course Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>
        <div className="add-product-name flex-col">
          <p>Course YouTube Link (*Optional)</p>
          <input
            onChange={onChangeHandler}
            value={data.youtubeLink}
            type="text"
            name="youtubeLink"
            placeholder="YouTube video link"
          />
        </div>
        <div className="add-catagory-price">
          <div className="add-catagory flex-col">
            <p>Course Rating</p>
            <input
              onChange={onChangeHandler}
              value={data.rating}
              type="Number"
              name="rating"
              placeholder="4.8"
            />
          </div>
          <div className="add-price flex-col">
            <p>Course Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="Number"
              name="price"
              placeholder="4500BDT"
            />
          </div>
          <div className="add-catagory flex-col">
            <p>Course Duration</p>
            <input
              onChange={onChangeHandler}
              value={data.duration}
              type="Number"
              name="duration"
              placeholder="8 Hrs"
            />
          </div>
          <button className="add-button flex-col" type="submit">
            ADD
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
