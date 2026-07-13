import mongoose from "mongoose";

export const onSiteCompSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide unique title"],
        unique: [true, "Title Exists"]
    },
    location: {
        type: String,
        required: [true, "Please provide location"],  
    },
    date: {
        type: Date,
        required: [true, "Please provide date"],
    },
    max_registerations: {
        type: Number,
        required: [true, "Please provide max number of registerations"],
    },
    registerations_completed: {
        type : Number,
        default : 0
    }
});

export default mongoose.model.onSiteCompSchema || mongoose.model('onSiteComp', onSiteCompSchema);