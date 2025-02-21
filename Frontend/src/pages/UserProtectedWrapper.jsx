import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserProtectedWrapper({ children }) {

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   
    axios.get(`${(import.meta.env.VITE_BASE_URL)}/users/profile`, {
      withCredentials:true
    }).then((response) =>{
        if(response.status === 200){
            setUser(response.data);
            setIsLoading(false);
        }
    }).catch((err)=>{
        console.log(err);
        navigate('/login')
    })
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

export default UserProtectedWrapper;
