import {autoComplete, getAddressCoordinate, getDistanceAndTime} from "../services/maps.service.js";
import { validationResult } from "express-validator";

const getCoordinates = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
    }
    const {address} = req.query;
    try {
        const coordinates = await getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({message:'Coordinates not found'})        
    }
}

const getDistanceTime = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
    }
    const {destinations,origins} = req.query;
    try {
        const distanceNtime = await getDistanceAndTime({destinations,origins});
        const distance = distanceNtime.distance.text;
        const time = distanceNtime.time.text;
        res.status(200).json({distance,time});
    } catch (error) {
        res.status(404).json({message:'Distance and Time not found'})        
    }  
}

const getSuggestions = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {input} = req.query;
    try {
        const suggestions = await autoComplete(input);
        res.status(200).json(suggestions);
    } catch (error) {
        console.log(error)
        res.status(404).json({message:'Suggestions not found'})
    }

}

export {
    getCoordinates,
    getDistanceTime,
    getSuggestions
}