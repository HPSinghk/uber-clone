import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"


const authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log("token is not found")
        return res.status(401).json({ message: "Unauthorized problem in token" }); 
    }
    
    const isBlacklisted = await User.findOne({token: token})

    if(isBlacklisted){
         return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        console.log("controller reached here")
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
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

export default authUser;
