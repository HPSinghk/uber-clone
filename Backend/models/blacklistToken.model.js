import mongoose from "mongoose";

// Create a schema for the blacklisted tokens
const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1d' // Automatically remove the token after 1 day
    }
});

export const BlacklistToken = mongoose.model('BlacklistToken', blacklistTokenSchema);

