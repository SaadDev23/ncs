import Post from "../model/Post.js"
import { Types } from 'mongoose';
const {ObjectId} = Types
import UserModel from "../model/User.model.js";

async function authenticatedUser(req) {
    const userId = req.user?.id || req.session?.user?.id;
    if (!userId) return null;
    return UserModel.findById(userId).select("_id username email role profilePicture").lean();
}

function findCommentIndex(comments, commentId) {
    return comments.findIndex((comment, index) =>
        String(comment.commentId || comment._id || index) === String(commentId),
    );
}

export const createPost = async (req, res) => {
    try {
        const { description = "", image = "" } = req.body;
        const user = await authenticatedUser(req);

        if (!user) {
            return res.status(401).send({ error: "Please log in to create a post." });
        }
        const postText = typeof description === "string" ? description.trim() : "";
        if (!postText && !image) {
            return res.status(400).send({ error: "Write something or add an image before posting." });
        }
        if (image && (typeof image !== "string" || !image.startsWith("data:image/") || image.length > 4 * 1024 * 1024)) {
            return res.status(400).send({ error: "Please choose a valid image smaller than 2 MB." });
        }

        const newPost = new Post({
            userId: user._id,
            userName: user.username,
            email: user.email,
            description: postText,
            image,
            comments: [],
            // Always use the saved account picture instead of browser-provided data.
            profilepicture: user.profilePicture || ""
        });

        await newPost.save();

        res.status(201).json({ post: newPost });
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
        const posts = await Post.find().sort({ createdAt: -1 }).lean();
        const authorIds = posts.map((post) => post.userId).filter(Boolean);
        const authors = await UserModel.find({ _id: { $in: authorIds } })
            .select("_id profilePicture")
            .lean();
        const pictureByAuthorId = new Map(
            authors.map((author) => [String(author._id), author.profilePicture || ""]),
        );
        const postsWithCurrentProfilePictures = posts.map((post) => ({
            ...post,
            profilepicture:
                pictureByAuthorId.get(String(post.userId)) || post.profilepicture || "",
        }));

        res.status(200).json(postsWithCurrentProfilePictures);
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
        const { text } = req.body;
        const user = await authenticatedUser(req);

        if (!user) {
            return res.status(401).json({ message: "Please log in to comment." });
        }
        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Comment text is required." });
        }

        const comment = {
            commentId: new Types.ObjectId().toString(),
            userId: user._id.toString(),
            userName: user.username,
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

/** Edit a comment. Only its author may edit it. */
export const editComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const { text } = req.body;
        const user = await authenticatedUser(req);

        if (!user) return res.status(401).json({ message: "Please log in to edit a comment." });
        if (!text || !text.trim()) return res.status(400).json({ message: "Comment text is required." });

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found." });

        const commentIndex = findCommentIndex(post.comments || [], commentId);
        if (commentIndex < 0) return res.status(404).json({ message: "Comment not found." });
        if (String(post.comments[commentIndex].userId) !== String(user._id)) {
            return res.status(403).json({ message: "You can only edit your own comments." });
        }

        post.comments[commentIndex].text = text.trim();
        post.comments[commentIndex].updatedAt = new Date();
        post.markModified("comments");
        await post.save();
        return res.status(200).json({ comments: post.comments });
    } catch (err) {
        console.error("Error editing comment:", err);
        return res.status(500).json({ message: "Unable to edit comment." });
    }
};

/** Delete a comment. Its author or an admin may delete it. */
export const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const user = await authenticatedUser(req);

        if (!user) return res.status(401).json({ message: "Please log in to delete a comment." });

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found." });

        const commentIndex = findCommentIndex(post.comments || [], commentId);
        if (commentIndex < 0) return res.status(404).json({ message: "Comment not found." });

        const isCommentOwner = String(post.comments[commentIndex].userId) === String(user._id);
        if (!isCommentOwner && user.role !== "admin") {
            return res.status(403).json({ message: "You can only delete your own comments." });
        }

        post.comments.splice(commentIndex, 1);
        post.markModified("comments");
        await post.save();
        return res.status(200).json({ comments: post.comments });
    } catch (err) {
        console.error("Error deleting comment:", err);
        return res.status(500).json({ message: "Unable to delete comment." });
    }
};

/** Edit a post. Only its author may edit it. */
export const editPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const user = await authenticatedUser(req);

        if (!user) return res.status(401).json({ message: "Please log in to edit a post." });
        if (!description || !description.trim()) {
            return res.status(400).json({ message: "Post text is required." });
        }

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found." });
        if (String(post.userId) !== String(user._id)) {
            return res.status(403).json({ message: "You can only edit your own posts." });
        }

        post.description = description.trim();
        await post.save();
        return res.status(200).json({ post });
    } catch (err) {
        console.error("Error editing post:", err);
        return res.status(500).json({ message: "Unable to edit post." });
    }
};

/** Delete a post. Its author or an admin may delete it. */
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await authenticatedUser(req);

        if (!user) return res.status(401).json({ message: "Please log in to delete a post." });

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found." });

        const isPostOwner = String(post.userId) === String(user._id);
        if (!isPostOwner && user.role !== "admin") {
            return res.status(403).json({ message: "You can only delete your own posts." });
        }

        await Post.deleteOne({ _id: post._id });
        return res.status(200).json({ message: "Post deleted successfully." });
    } catch (err) {
        console.error("Error deleting post:", err);
        return res.status(500).json({ message: "Unable to delete post." });
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
