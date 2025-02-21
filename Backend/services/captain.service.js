import { Captain } from "../models/captain.model.js";


const createCaptain = async ({
    firstName,lastName,email,password,color, plate, capacity, vehicleType
}) =>{
     if (!firstName || !email || !password || !color || !plate || !capacity || !vehicleType){
    throw new Error("All fields are required");
     }
    const captain  = Captain.create({
        fullName:{
            firstName,
            lastName
        },
        email,
        password,
        vehicle:{
            color,
            plate,
            capacity,
            vehicleType
        }
    })

    return captain;
}



export default createCaptain;