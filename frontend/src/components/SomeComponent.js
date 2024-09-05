// src/components/SomeComponent.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const SomeComponent = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/some-protected-endpoint');
                setData(response.data);
            } catch (error) {
                console.error('API request failed', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {data ? <p>{data.someField}</p> : <p>Loading...</p>}
        </div>
    );
};

export default SomeComponent;
