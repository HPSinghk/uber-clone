import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectToDb from './db/db.js';
import router from './routes/user.routes.js';

const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser())

connectToDb();



app.get('/',(req,res)=>{
    res.send("hello world");
});

app.use('/users',router)

export default app;