import mongoose from "mongoose";

export const pastPaper = new mongoose.Schema({
    name: {
        type: String,
        required: [true , "Please provide unique title"],
        unique: false
    },
    link: {
        type: String,
        required: [true, "Please provide link"],
        unique: true,
    },
    date: {
        type: Date,
        required: false,
        unique: false, 
    },
    kind: {
        type: String,
        required: [true, "Please provide type"],
        unique: false,  
    },
    

});

export default mongoose.model.pastPaper || mongoose.model('pastPaper', pastPaper);