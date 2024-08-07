import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import cross_icon from '../assets/cross_icon.png'; 
import cross_icon_dark from '../assets/cross_icon_dark.png';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';

const LoginPopup = ({ setShowLogin, theme }) => {

    const {url, setToken} = useContext(StoreContext)
    

    
     

    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name:"",
        email:"",
        password:""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data, [name]:value}));
    }

    const onLogin = async (event) =>{
        event.preventDefault();
        let newUrl = url;
        if(currState==="Login"){
            newUrl += "/api/user/login"
        }
        else{
            newUrl += "/api/user/register"
        }

        const response = await axios.post(newUrl, data)

        if(response.data.success){
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false)
        }
        else{
            alert(response.data.message);
        }
    }

    
  

    return (
        <div className={`login-popup ${theme}`}>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={theme === 'light' ? cross_icon : cross_icon_dark} alt="Close" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? null : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Name' required />}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                <button type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>
                {/* <div className="login-popup-condition">
                    <input id='tick' type="checkbox" required />
                    <p id='condition'>By continuing, I agree to the terms of use & privacy policy.</p>
                </div> */}
                {currState === "Login"
                    ? <p>Don't have an account? <span onClick={() => setCurrState("Sign Up")}><p className="link_line">Click here</p></span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState("Login")}><p className="link_line">Login</p></span></p>
                }
            </form>
        </div>
    );
}

export default LoginPopup;
