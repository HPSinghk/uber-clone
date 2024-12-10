import mongoose from "mongoose";


function connectToDb() {
    mongoose.connect(
        process.env.DB_CONNECT
    )
    .then(() => {
        console.log("Database connected successfully!");
    })
    .catch((error) => {
        console.error("Database connection failed:", error.message);
        process.exit(1); // Exit the process with a failure code
    });
}


export default connectToDb;