import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minlength: [5, "Name must have at least 5 character"],
    },
    lastName: {
      type: String,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },
  activeRideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride",
  }, 
  pastRides: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride"
    }],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcryptjs.hash(password, 10);
};

export const User = mongoose.model("User", userSchema);
