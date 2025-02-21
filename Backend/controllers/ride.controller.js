import { validationResult } from "express-validator";
import { confirmRideService, createRideService, endRideService, getFareService, startRideService  } from "../services/ride.service.js";
import { getAddressCoordinate, getCaptainsInTheRadiusService } from "../services/maps.service.js";
import { Ride } from "../models/ride.model.js";
import { sendMessageToSocketId } from "../socket.js";



const createRide  = async(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        const ride = await createRideService({ userId: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride);

        

        const pickupCoordinates = await getAddressCoordinate(pickup);



        const captainsInRadius = await getCaptainsInTheRadiusService(pickupCoordinates.lng, pickupCoordinates.lat, 100);
        console.log(`these are available `,captainsInRadius)
        ride.otp = ""

        const rideWithUser = await Ride.findOne({ _id: ride._id }).populate('user');

        captainsInRadius.map(captain => {

            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })

        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}


const getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await getFareService(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


const confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await confirmRideService({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

const startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await startRideService({ rideId, otp, captain: req.captain });
        console.log("ride after ongoing")
        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


const endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await endRideService({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            
            event: 'ride-ended',
            data: ride,
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } 
}

const userSearchRide = async (req, res) => {
    // Validate incoming request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Get the user's activeRideId
        const user = req.user
        if (!user || !user.activeRideId) {
            return res.status(404).json({ message: "No active ride found for this user." });
        }

        // Find the active ride
        const ride = await Ride.findById(user.activeRideId).populate('user').populate('captain','fullName vehicle location').select('+otp');
        if (!ride) {
            return res.status(404).json({ message: "Ride not found." });
        }

        return res.status(200).json(ride);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};
const captainSearchRide = async (req, res) => {
    // Validate incoming request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Get the user's activeRideId
        const captain = req.captain
        if (!captain || !captain.activeRideId) {
            return res.status(404).json({ message: "No active ride found for this captain." });
        }

        // Find the active ride
        const ride = await Ride.findById(captain.activeRideId).populate('captain');
        if (!ride) {
            return res.status(404).json({ message: "Ride not found." });
        }

        return res.status(200).json(ride);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};



export {
    createRide,
    getFare,
    confirmRide,
    startRide,
    endRide,
    userSearchRide,
    captainSearchRide
}