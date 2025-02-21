import React, { createContext, useState } from 'react'


export const FareDataContext = createContext();

const FareContext = ({children}) => {
    const [fare, setFare] = useState({
        car:0,
        auto:0,
        moto:0
    });
    const [vehicleType,setVehicleType] = useState(null)
    const [pickup, setPickup] = useState("");
    const [destination, setDestination] = useState("");
  return (
    <div>
       <FareDataContext.Provider value ={{fare, setFare,vehicleType,setVehicleType,pickup,setPickup,destination, setDestination}}>
       {children}
       </FareDataContext.Provider>
    </div>
  )
}

export default FareContext;
