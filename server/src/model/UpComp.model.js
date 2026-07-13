import mongoose from "mongoose";

export const UpCompSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true , "Please provide unique title"],
        unique: [true , "Title Exists"]
    },
    link: {
        type: String,
        required: [true, "Please provide link"],
        unique: true,
    },
    date: {
        type: Date,
        required: [true, "Please provide date"],
        unique: false, 
    },
    location: {
        type: String,
        required: [true, "Please provide location"],
        unique: false,  
    },
    kind: {
        type: String,
        required: [true, "Please provide kind"],
        unique: false,
    }
    

});

export default mongoose.model.UpComp || mongoose.model('Upcomp', UpCompSchema);