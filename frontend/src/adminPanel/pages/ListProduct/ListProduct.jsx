import React, { useEffect ,useState} from 'react'
import './ListProduct.css'
import axios from 'axios';
import { toast } from 'react-toastify';

const ListProduct = () => {
    
    const [list,setList] = useState([]);
    let url = "/api/course"

    const fetchList= async()=>{
        //url += "/api/course/list";
        const response = await axios.get(`/list`);
        
        if(response.data.success){
            
            setList(response.data.data);

        }else{
            toast.error("Error!");
            console.log("Error is here");
        }
    }
    useEffect(()=>{
        fetchList();
    },[])

    const removeItem= async(courseId)=>{
        //url = "https://skill-voyage-api.vercel.app"
        //url += "/api/course/remove";
        const response= await axios.post(`/remove`,{id:courseId});
        await fetchList();
        if(response.data.success){
            toast.success(response.data.message)
        }else{
            toast.error("Error!")
        }
        
   }

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
        {list.map((item,index)=>{
             return (
                <div key={index} className='list-table-format'>
                    <img src={`${url}/images/`+item.image} alt="" />

                    <p>{item.name}</p>
                    <p>{item.description}</p>
                    <p>${item.price}</p>
                    <p className='cursor' onClick={()=>{removeItem(item._id)}}>X</p>

                </div>
             )
        })}
       </div>
    </div>
  )
}

export default ListProduct