import express from 'express';
const router = express.Router();
import { body, query } from 'express-validator';
import { authCaptain, authUser } from '../middlewares/auth.middleware.js';
import { captainSearchRide, confirmRide, createRide, endRide, getFare,  startRide, userSearchRide } from '../controllers/ride.controller.js';


router.post('/create',
    authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
    createRide
)

router.get('/get-fare',
    authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    getFare
)

 router.post('/confirm',
    authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    confirmRide
)

router.get('/start-ride',
    authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    startRide
)

router.post('/end-ride',
    authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    endRide
)

router.get('/user/search-ride',
    authUser,
    userSearchRide
)

router.get('/captain/search-ride',
    authCaptain,
    captainSearchRide
)


export default router;