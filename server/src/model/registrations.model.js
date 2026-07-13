import mongoose from "mongoose";

export const registerationsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide title"],
    },
    member1: {
        type:  String,
    },
    member2: {
        type:  String,
    },
    member3: {
        type:  String,
    },
    phone_number: {
        type: String,
        required: [true, "Please provide the contact person's name"],
    },
    team_name: {
        type: String,
        required: [true, "Please provide the team name"],
    },
});

export default mongoose.model.registerationsSchema || mongoose.model('registerations', registerationsSchema);
