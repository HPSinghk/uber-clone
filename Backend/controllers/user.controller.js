import { BlacklistToken } from "../models/blacklistToken.model.js";
import { User } from "../models/user.model.js"; 
import { createUser } from "../services/user.service.js";
import { validationResult } from "express-validator";

const registerUser = async (req, res, next)=>{
    /* console.log("register user is called");
    console.log(req.body); */
    const errors =  validationResult(req);
    if(!errors.isEmpty()){
     return res.status(400).json({errors: errors.array()});
    }
   /*  console.log(req.body); */
    const {fullName, email, password} = req.body;

    const userAlreadyExist = await User.findOne({email});
    if(userAlreadyExist){
         return res.status(400).json({message: "User already exist found here"});
    }

    const hashPassword = await User.hashPassword(password);

    const user = await createUser({
        firstName: fullName.firstName,
        lastName: fullName.lastName,
        email,
        password: hashPassword
    })

    const token = user.generateAuthToken();

    res.cookie('user-token',token,{
        httpOnly: true,
    })

    return res
    .status(201)
    .json({
        token, 
        user,
        message: "User registered successfully"
    })
    
}

const loginUser = async (req ,res ,next) => {
    
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {email, password } = req.body;

        const user  = await User.findOne({email}).select('+password');

        if(!user){
            return res.status(401).json({message: "Invalid email or password"})
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return res.status(401).json({message: "Invalid email or password"})
        }

        const token = await user.generateAuthToken();
        
        await res.
        cookie('user-token',token,{
            httpOnly: true,
        })
    
        return res.status(200).json({
            token,
            user,
            message: "User login successfully"
        })
}

const getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}

const logoutUser = async (req, res, next) => {

    const token = req.cookies['user-token']|| req.headers.authorization.split(' ')[1];

    res.clearCookie('user-token');
    await BlacklistToken({token});

    res.status(200).json({message:"Logout successfully"})
          
}



export {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser
}