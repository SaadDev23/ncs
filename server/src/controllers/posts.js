import Post from "../model/Post.js"
import { Types } from 'mongoose';
const {ObjectId} = Types
import UserModel from "../model/User.model.js";

export const createPost = async (req, res) => {
    try {
        const { description, profilepicture, userId, userName } = req.body;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const newPost = new Post({
            userId: userId,
            userName: userName,
            email: user.email,
            description,
            comments: [],
            profilepicture: profilepicture
        });

        await newPost.save();

        const posts = await Post.find();

        console.log("New Post:", newPost); // Add this log

        res.status(201).json(posts);
    } catch (err) {
        console.error("Error Creating Post:", err); // Add this log
        res.status(409).json({ message: err.message });
    }
}

export const updatePostLikes = async (req, res) => {
    const { id, userId } = req.body
    const UserID = new ObjectId(userId)
    console.log(req.body)
    console.log(UserID)

    try {
        const exist = await Post.findOne({
            _id: id, 
            likedBy : UserID
        })
        if(exist)
        {
            await Post.findOneAndUpdate(
                { _id: id },
                {
                  $inc: { likes: -1 }, // Decrement likes by 1
                  $pull: { likedBy: UserID }, // Remove UserID from likedBy array
                },
                { new: false }
              );
              
              // Remove post from likedPosts array in UserModel
              await UserModel.findByIdAndUpdate(UserID, {
                $pull: { likedPosts: id }, // Remove postId from likedPosts array
              });

            console.log('Like decrement')
            return res.status(201).send({ msg: `what made you dislike the post` })

        }
        const post = await Post.findOneAndUpdate(
            { _id: id },
            {
                $inc: { likes: 1 },
                $addToSet: { likedBy: UserID }, // Use $addToSet to add UserID only if not already present
            },
            { new: false }
        );
        await UserModel.findByIdAndUpdate(UserID,  {
            $addToSet: { likedPosts: id }, // Use $addToSet to add userId only if not already present
        },);
        res.status(200).send({ msg: 'Liked successfully' })
    } catch (error) {

            console.error("Error updating post likes:", error);
            res.status(500).send('Internal Server Error');
    }
}


/** Read */
export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};


export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const post = await Post.find({ username });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

/** Add comment to post */
export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, userName, text } = req.body;

        if (!userId || !userName || !text || !text.trim()) {
            return res.status(400).json({ message: 'userId, userName and comment text are required' });
        }

        const comment = {
            userId,
            userName,
            text: text.trim(),
            createdAt: new Date(),
        };

        const post = await Post.findByIdAndUpdate(
            id,
            { $push: { comments: comment } },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(201).json(post);
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ message: err.message });
    }
};

/** Update */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(username);

        if (isLiked) {
            post.likes.delete(username)
        } else {
            post.likes.set(username, true)
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}