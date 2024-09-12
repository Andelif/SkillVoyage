import React,{useState,useEffect} from 'react'
import './Orders.css'
import {toast} from "react-toastify"
import {assets} from "../../assets/assets"
import axios from 'axios'

const Orders = ({url}) => {

  const [orders,setOrders] = useState([]);
  const fetchAllOrders = async () => {
    try {
      // Make the API call
      const response = await axios.get( url+"/api/order/list");
      
      // Check if the response is successful
      if (response.data.success) {
        // Update state with the list of orders
        setOrders(response.data.data);
        console.log(response.data.data);
      } else {
        // Show an error message if the API response is not successful
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error("Error fetching orders:", error);
      toast.error("An error occurred while fetching orders");
    }
  };
  

  // const fetchAllOrders = async () => {
  //   const response = await axios.get(url+"/api/order/list");
  //   if(response.data.success){
  //     setOrders(response.data.data);
  //     console.log(response.data.data);
  //   }
  //   else{
  //     toast.error("error")

  //   }
  // }
  const statusHandler = async (event,orderId) => {
    const response = await axios.post(url+"/api/order/status",{
      orderId,
      status: event.target.value
      
    })
    console.log(status);
    if(response.data.success){
      await fetchAllOrders();
    }

  }
  useEffect(()=>{
    fetchAllOrders();

  },[])

  
  return (
    <div className = 'order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order,index)=>(
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-gadget'>
                {order.items.map((item,index)=>{
                  if(index === order.items.length -1){
                    return item.name + " x " + item.quantity
                  }
                  else {
                    return item.name + " x " + item.quantity + " , "
                  }
                })}
              </p>
              <p className='order-item-name'>{order.address.firstName+" "+order.address.lastName}</p>
              <div className="order-item-address">
                <p>{order.address.street+","}</p>
                <p>{order.address.city+","+order.address.state+","+order.address.country +","+order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items:{order.items.length}</p>
            <p>${order.amount}</p>
            <select onChange={(event)=>statusHandler(event,order._id)} value = {order.status}>
              <option value="Device Processing">Device Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>

          </div>
        ))}

      </div>

    </div>
  )
}

export default Orders