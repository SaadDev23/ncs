import { ObjectId } from "mongodb";
import mongoose, { mongo } from "mongoose";

const postSchema = mongoose.Schema(
{
    userId: {
        type: ObjectId,
        required: true,
    },
    userName :{
        type :String,

    },
    email: {
        type: String,
        required: true,
    },
    location: String,
    description: {
        type: String,
        required : true
    },
    profilepicture: String,
    userPicturePath: String,
    likes: {
        type: Number,
        default: 0
    },
    likedBy: {
        type :[ObjectId],
        default: [],
    },
    comments: {
        type: Array,
        default: []
    }
},
{timestamps: true}

);

const Post = mongoose.model("Post", postSchema);

export default Post;