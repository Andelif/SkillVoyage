import React, { useEffect, useState } from 'react';
import './ListInstructor.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { apiClient } from '../../../services/apiClient';
import Loader from '../../../components/Loader'; // Import the Loader component

const ListInstructor = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true); // State to manage loading

    const fetchList = async () => {
        try {
            setLoading(true); // Start loading when fetching begins
            const accessToken = localStorage.getItem('accessToken');

            const response = await apiClient.get('/instructor/list', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // Attach token here
                    'Content-Type': 'application/json',
                }
            });
            if (response.data.success) {
                setList(response.data.data);
            } else {
                toast.error("Error fetching Instructor list!");
            }
        } catch (error) {
            toast.error("An error occurred while fetching the Instructor list.");
        } finally {
            setLoading(false); // Stop loading once the fetch completes
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    const removeItem = async (instructorId) => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            const response = await apiClient.post("/instructor/remove", { id: instructorId }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // Attach token here
                    'Content-Type': 'application/json',
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                await fetchList(); // Refetch the list after removing an item
            } else {
                toast.error("Error removing Instructor!");
            }
        } catch (error) {
            toast.error("An error occurred while removing the Instructor.");
        }
    };

    return (
        <div className='list add flex-col'>
            {/* Show the loader while loading is true */}
            {loading ? (
                <Loader />
            ) : (
                <div className="list-table">
                    <div className="list-table-format title">
                        <b>Image</b>
                        <b>Name</b>
                        <b>Qualification</b>
                        <b>Rating</b>
                        <b>Action</b>
                    </div>
                    {list.map((item, index) => {
                        return (
                            <div key={index} className='list-table-format'>
                                <img src={item.image} alt="" />
                                <p>{item.name}</p>
                                <p>{item.qualification}</p>
                                <p>{item.rating}</p>
                                
                                <button className='del-btn' onClick={() => { removeItem(item._id) }}>DELETE</button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ListInstructor;
