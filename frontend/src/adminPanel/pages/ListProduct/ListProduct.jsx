import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const ListProduct = () => {
    const url = "https://skill-voyage-api.vercel.app/api/course/list";
    const [list, setList] = useState([]);

    const fetchList = async () => {
        try {
            const response = await axios.get(url);
            if (response.data.success) {
                setList(response.data.data);
            } else {
                toast.error("Error fetching course list!");
            }
        } catch (error) {
            toast.error("An error occurred while fetching the course list.");
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    const removeItem = async (courseId) => {
        try {
            const response = await axios.post("https://skill-voyage-api.vercel.app/api/course/remove", { id: courseId });
            await fetchList();
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error("Error removing course!");
            }
        } catch (error) {
            toast.error("An error occurred while removing the course.");
        }
    };

    return (
        <div className='list add flex-col'>
            <p>All items list</p>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Description</b>
                    <b>Price</b>
                    <b>Action</b>
                </div>
                {list.map((item, index) => {
                    return (
                        <div key={index} className='list-table-format'>
                            <img src={item.image} alt="" />
                            <p>{item.name}</p>
                            <p>{item.description}</p>
                            <p>${item.price}</p>
                            <p className='cursor' onClick={() => { removeItem(item._id) }}>X</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ListProduct;
