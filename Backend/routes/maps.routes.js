import express from "express";
import { getCoordinates, getDistanceTime, getSuggestions } from "../controllers/map.controller.js";
import { query } from "express-validator";
import { authUser,  } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/get-coordinates",
  query("address").isString().isLength({ min: 3 }),
  getCoordinates
);

router.get('/get-distance-time',
  query("origins").isString().isLength({ min: 3 }),
  query("destinations").isString().isLength({ min: 3 }),
  authUser,
  getDistanceTime
)

router.get('/get-suggestions',
  query("input").isString().isLength({ min: 1 }),
  authUser,
  getSuggestions
)

export default router;
