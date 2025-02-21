import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectToDb from './db/db.js';
import userRouter from './routes/user.routes.js';
import captainRouter from './routes/captain.routes.js';
import mapRouter from './routes/maps.routes.js'
import rideRouter from './routes/ride.routes.js'

const app = express();
app.use(cors({
    origin:['http://localhost:5173','https://go-sefast.netlify.app'], // Replace with your frontend's URL
    credentials: true, // Allow cookies to be sent with requests
  }));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser())

connectToDb();



app.get('/',(req,res)=>{
    res.send("hello world");
});

app.use('/users',userRouter)
app.use('/captains',captainRouter)
app.use('/maps',mapRouter)
app.use('/rides',rideRouter)


export default app;