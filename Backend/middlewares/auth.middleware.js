import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { Captain } from "../models/captain.model.js";
import { BlacklistToken } from "../models/blacklistToken.model.js";





const authUser = async (req, res, next) => {
    const token = req.cookies['user-token'] || req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log("token is not found")
        return res.status(401).json({ message: "Unauthorized problem in token for user" }); 
    }
    
    const isBlacklisted = await BlacklistToken.findOne({token: token})

    if(isBlacklisted){
         return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        /* console.log(decoded); */
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }catch(err){
        return res.status(401).json({ message: "Unauthorized problem in decoding" });

    }
}
const authCaptain = async (req, res, next) => {

    const token = req.cookies['captain-token'] || req.headers.authorization?.split(' ')[1];
 
    if (!token) {
        console.log("token is not found")
        return res.status(401).json({ message: "Unauthorized problem in token for captain" }); 
    }
    
    const isBlacklisted = await BlacklistToken.findOne({token: token})

    if(isBlacklisted){
         return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
       /*  console.log(decoded); */
        const captain = await Captain.findById(decoded._id);
        if (!captain) {
            return res.status(404).json({ message: "User not found" });
        }
        req.captain = captain;
        next();
    }catch(err){
        console.log(err)
        return res.status(401).json({ message: "Unauthorized problem in decoding" });

    }
}

export {
    authUser,
    authCaptain,
}
