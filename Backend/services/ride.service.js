import { Captain } from "../models/captain.model.js";
import { Ride } from "../models/ride.model.js"; 
import { User } from "../models/user.model.js";
import { getDistanceAndTime } from "./maps.service.js";
import crypto from "crypto";


 async function getFareService(pickup, destination) {
    if (!pickup || !destination) {
        throw new error ("Pickup and destination are required");
    }
    console.log({pickup, destination});
    const distanceTime = await getDistanceAndTime({origins:pickup,destinations:destination});
    
    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };



    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.time.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.time.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.time.value / 60) * perMinuteRate.moto))
    };

    return fare;
}

function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num));
        return otp;
    }
    return generateOtp(num);
}


const createRideService = async ({userId, pickup, destination, vehicleType}) =>{
    if(!userId || !pickup || !destination || !vehicleType) {
        throw new Error("all fields are required");
    }

    const fare = await getFareService(pickup, destination);
    console.log(fare);

    const ride = await Ride.create({
        user:userId,
        pickup,
        destination,
        otp:getOtp(6),
        fare:fare[vehicleType]
    });


    await User.findByIdAndUpdate(
        userId,
        {
            activeRideId: ride._id,
            $push: { pastRides: ride._id }, // Adds the ride to pastRides
        },
        { new: true }
    );


    return ride;

}


const confirmRideService = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await Ride.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await Ride.findOne({
        _id: rideId
    }).populate('user').populate('captain','fullName').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    await Captain.findByIdAndUpdate(
        captain._id,
        {
            activeRideId: ride._id,
        },
        { new: true }
    );

    return ride;

}

const startRideService = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }
    console.log(otp)

    const ride = await Ride.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }
    console.log(ride.otp)
    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await Ride.findByIdAndUpdate({
        _id: rideId
    }, {
        status:'ongoing'
    },{
        new:true,
    })

    return ride;
}


const endRideService = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await Ride.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await Ride.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}


export {
    createRideService,
    getFareService,
    confirmRideService,
    startRideService,
    endRideService
};