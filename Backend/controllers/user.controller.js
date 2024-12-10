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

    const {fullName, email, password} = req.body;

    const hashPassword = await User.hashPassword(password);

    const user = await createUser({
        firstName: fullName.firstName,
        lastName: fullName.lastName,
        email,
        password: hashPassword
    })

    const token = user.generateAuthToken();
    res.status(201).json({
        token, 
        user,
        message: "User registered successfully"
    })
}


export {
    registerUser
}