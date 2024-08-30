// import React from 'react'
// import { useAuth0 } from "@auth0/auth0-react";


// const LoginButton = () => {
//     const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();
    
//     if(isAuthenticated){
//         return (
//             <div className='UserInfo'>
//                 <button className='LoginBtn'
//                 onClick={() => logout({ returnTo: window.location.origin })}>LogOut
//                 </button>
//                 <h2 className='userName'>{user.name}</h2>
//             </div>
//           )
//     }else{
//         return (
//             <div className='UserInfo'>
//                 <button className='LoginBtn'
//                 onClick={() => loginWithRedirect()}>Log In
//                 </button>
//             </div>
//         )
//     }

// };

// export default LoginButton;
