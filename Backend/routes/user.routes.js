import express from "express"
import { body } from "express-validator";
import { registerUser, loginUser, getUserProfile, logoutUser } from "../controllers/user.controller.js";
import{ authUser} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post('/register',/*  (req, res, next) => {
    console.log(req.body); // Log the incoming request body
    next();
}, */[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullName.firstName').isLength({min: 5}).withMessage('FirstName must have atleast 5 character'),
    body('password').isLength({min:6}).withMessage('Password must have 6 character')
],
registerUser)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage("Password is incorrect")
],
loginUser)

router.get('/profile', authUser, getUserProfile)

router.get('/logout', authUser, logoutUser )

export default router;