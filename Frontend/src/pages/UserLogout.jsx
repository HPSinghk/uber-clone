import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const UserLogout = () => {

    const navigate = useNavigate()

    axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`,{
       withCredentials:true
    }).then((response) =>{
        if(response.status===200){
            navigate('/login')
        }
    })
  return (
    <div>UserLogout</div>
  )
}

export default UserLogout