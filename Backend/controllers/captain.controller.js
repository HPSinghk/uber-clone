import { Captain } from "../models/captain.model.js";
import createCaptain from "../services/captain.service.js";
import { validationResult } from "express-validator";
import { BlacklistToken } from "../models/blacklistToken.model.js";


  const registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {fullName, email, password, vehicle} = req.body;

    const isCaptainAlreadyExist = await Captain.findOne({ email });

    if(isCaptainAlreadyExist){
        return res.status(400).json({ message: "Captain already exist" });
    }

    const hashedPassword = await Captain.hashPassword(password);

    const captain = await createCaptain({
        firstName:fullName.firstName,
        lastName:fullName.lastName,
        email,
        password:hashedPassword,
        color:vehicle.color,
        plate:vehicle.plate,
        capacity:vehicle.capacity,
        vehicleType:vehicle.vehicleType
    });

    const token =  await captain.generateAuthToken();
    //console.log(token); -->> phle await nhi agaya tha to token nhi aa pa rha tha

    res.cookie('captain-token',token,{
        httpOnly:true,
        secure: true,         // Ensures cookies are only sent over HTTPS
        sameSite: "none", 
    })

    return res
    .status(201)
    .json({token, captain,message:"captain registered successfully"})
    
};

const getCaptainProfile = async (req, res, next) => {
    res.status(200).json(req.captain);
}

const loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password } = req.body;

    const captain  = await Captain.findOne({email}).select('+password');

    if(!captain){
        return res.status(401).json({message: "Invalid email or password"})
    }

    const isMatch = await captain.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message: "Invalid email or password"})
    }

    const token = await captain.generateAuthToken();
    
    res.cookie('captain-token', token,{
        httpOnly:true,
        secure: true,         // Ensures cookies are only sent over HTTPS
        sameSite: "none", 
    })

    return res
    .status(200)
    .json({
        token,
        captain,
        message: "Captain login successfully"
    })

}

const logoutCaptain = async (req, res, next) => {
    //console.log("logout me aaya")
    const token = req.cookies['captain-token'];
    if(!token){
        return res.status(401).json({message: "Please login first"})
    }
    
    res.clearCookie('captain-token'); 
    
    await BlacklistToken({token});

    res.status(200).json({message:"Captain Logout successfully"})
          
}
 
export {
    registerCaptain,
    loginCaptain,
    getCaptainProfile,
    logoutCaptain
}