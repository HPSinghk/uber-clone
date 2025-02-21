import React, { useContext, useEffect, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainProtectWrapper = ({
    children
}) => {

    const navigate = useNavigate()
    const { captain, setCaptain } = useContext(CaptainDataContext)
    const [ isLoading, setIsLoading ] = useState(true)


    useEffect(() => {

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            withCredentials:true
        }).then(response => {
            if (response.status === 200) {
               // console.log(response.data)
                setCaptain(response.data)
                setIsLoading(false)
            }
        })
            .catch(err => {
                console.log(err)
                navigate('/captain-login')
            })
    }, [  ])

    

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }



    return (
        <>
            {children}
        </>
    )
}

export default CaptainProtectWrapper