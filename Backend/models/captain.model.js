import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'


const captainSchema = new mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            required:true,
            minLength:[5,'Firstname atleast must have 5 character']
        },
        lastName:{
            type:String,
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    socketId:{
        type:String
    },
    status:{
        type:String,
        enum:['active', 'inactive'],
        default:'inactive'
    },
    activeRideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
      }, 
    vehicle:{
        color:{
            type:String,
            required:true,
            minLength:[3,'Color must be 3 characters long']
        },
        plate:{
            type:String,
            required:true,
            minLength:[4,'Number must be 4 characters long']
        },
        capacity:{
            type:Number,
            required:true,
            min:[1,'Capacity must be atleast 1']
        },
        vehicleType:{
            type:String,
            required:true,
            enum:['car','motorcycle','auto']
        }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // GeoJSON requires 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers: [longitude, latitude]
            required: true
        }
    }
})

captainSchema.index({location:'2dsphere'})

captainSchema.methods.generateAuthToken = async function(){
     const token = jwt.sign( 
        {_id:this._id},
        process.env.JWT_SECRET,
        {expiresIn:'1d'}
     )
     return token;
}

captainSchema.methods.comparePassword = async function(password){
    return await bcryptjs.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function(password){
    return await bcryptjs.hash(password,10);
}

export const Captain = mongoose.model("Captain",captainSchema)