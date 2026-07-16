import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { IconLike } from "../IconLike";
import { Avatar } from "../Avatar/Avatar";
import "./style.css";
import { toast } from "react-toastify";


export const Post = ({
  dark,
  className,
  text = "Default text",
  text1 = "Default user",
  text2,
  text3,
  text4,
  comments: commentsProp = [],
  iconLikeIconLikeClassName,
  iconLikeHeartClassName,
  profilepicture,
  idd,
  postUserId,
  onPostUpdated,
  onPostDeleted,
}) => {
  const comments = Array.isArray(commentsProp) ? commentsProp : [];

  const [isLiked, setIsLiked] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(comments);
  const [localLikeCount, setLocalLikeCount] = useState(Number(text3) || 0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [commentActionId, setCommentActionId] = useState(null);
  const [postText, setPostText] = useState(text);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [isSavingPost, setIsSavingPost] = useState(false);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  useEffect(() => {
    setLocalLikeCount(Number(text3) || 0);
  }, [text3]);

  useEffect(() => {
    setPostText(text);
  }, [text]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/me", {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        const { sessionUser } = result;
        setUserInfo(sessionUser);
      } catch (error) {
        console.error('Error Fetching User data', error);
      }
    };

    fetchUserInfo();
  }, []);

  // Sync isLiked with server state when userInfo loads (handles string vs ObjectId)
  useEffect(() => {
    if (!userInfo || !idd) return;
    const liked = userInfo.likedPosts && userInfo.likedPosts.some(
      (pid) => String(pid) === String(idd)
    );
    setIsLiked(!!liked);
  }, [userInfo, idd]);

  const handleLikeClick = async () => {
    if (!userInfo?.id) {
      toast.info("Please log in to like");
      return;
    }
    const previousLiked = isLiked;
    const previousCount = localLikeCount;
    setIsLiked(!isLiked);
    setLocalLikeCount((c) => (isLiked ? c - 1 : c + 1));
    try {
      const data = {
        id: idd,
        text3,
        userId: userInfo.id
      };
      const response = await fetch("http://localhost:8080/posts/update-likes", {
        method: 'PUT',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.status === 200) {
        toast.success("Liked", {
          autoClose: 800,
          hideProgressBar: true,
          position: "top-center"
        });
      } else if (response.status === 201) {
        toast.success("Unliked", {
          autoClose: 800,
          hideProgressBar: true,
          position: "top-center"
        });
      } else {
        setIsLiked(previousLiked);
        setLocalLikeCount(previousCount);
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      setIsLiked(previousLiked);
      setLocalLikeCount(previousCount);
      toast.error(error.message || "Failed to update like", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored"
      });
      console.error('Error updating like', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;
    if (!userInfo?.id || !userInfo?.username) {
      toast.info("Please log in to comment");
      return;
    }
    setIsSubmittingComment(true);
    try {
      const response = await fetch(`http://localhost:8080/posts/${idd}/comment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        // Keep these fields for compatibility with an older deployed backend.
        // The current backend derives the author from the authenticated session.
        body: JSON.stringify({
          userId: userInfo.id,
          userName: userInfo.username,
          text: trimmed,
        }),
      });
      const result = await response.json();
      if (response.ok && result.comments) {
        setLocalComments(result.comments);
        setCommentText("");
        toast.success("Comment added", {
          autoClose: 1000,
          hideProgressBar: true,
          position: "top-center",
        });
      } else {
        toast.error(result.message || "Failed to add comment");
      }
    } catch (err) {
      toast.error(err.message || "Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const commentKey = (comment, index) => String(comment.commentId || comment._id || index);
  const ownsComment = (comment) =>
    userInfo?.id && String(comment.userId) === String(userInfo.id);

  const saveEditedComment = async (comment, index) => {
    const trimmed = editingCommentText.trim();
    const key = commentKey(comment, index);
    if (!trimmed) {
      toast.error("Comment cannot be empty");
      return;
    }

    setCommentActionId(key);
    try {
      const response = await fetch(
        `http://localhost:8080/posts/${idd}/comment/${encodeURIComponent(key)}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed }),
        },
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Failed to edit comment");
      setLocalComments(result.comments || []);
      setEditingCommentId(null);
      setEditingCommentText("");
      toast.success("Comment updated", { autoClose: 900, hideProgressBar: true, position: "top-center" });
    } catch (error) {
      toast.error(error.message || "Failed to edit comment");
    } finally {
      setCommentActionId(null);
    }
  };

  const deleteComment = async (comment, index) => {
    const key = commentKey(comment, index);
    if (!window.confirm("Delete this comment?")) return;

    setCommentActionId(key);
    try {
      const response = await fetch(
        `http://localhost:8080/posts/${idd}/comment/${encodeURIComponent(key)}`,
        { method: "DELETE", credentials: "include" },
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Failed to delete comment");
      setLocalComments(result.comments || []);
      if (editingCommentId === key) {
        setEditingCommentId(null);
        setEditingCommentText("");
      }
      toast.success("Comment deleted", { autoClose: 900, hideProgressBar: true, position: "top-center" });
    } catch (error) {
      toast.error(error.message || "Failed to delete comment");
    } finally {
      setCommentActionId(null);
    }
  };

  const isPostOwner = userInfo?.id && String(postUserId) === String(userInfo.id);
  const canDeletePost = isPostOwner || userInfo?.role === "admin";

  const saveEditedPost = async () => {
    const description = postText.trim();
    if (!description) {
      toast.error("Post cannot be empty");
      return;
    }

    setIsSavingPost(true);
    try {
      const response = await fetch(`http://localhost:8080/posts/${idd}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Failed to edit post");
      setPostText(result.post?.description || description);
      setIsEditingPost(false);
      onPostUpdated?.(result.post);
      toast.success("Post updated", { autoClose: 900, hideProgressBar: true, position: "top-center" });
    } catch (error) {
      toast.error(error.message || "Failed to edit post");
    } finally {
      setIsSavingPost(false);
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Delete this post and all of its comments?")) return;

    setIsSavingPost(true);
    try {
      const response = await fetch(`http://localhost:8080/posts/${idd}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Failed to delete post");
      onPostDeleted?.(idd);
      toast.success("Post deleted", { autoClose: 900, hideProgressBar: true, position: "top-center" });
    } catch (error) {
      toast.error(error.message || "Failed to delete post");
      setIsSavingPost(false);
    }
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date(text2));


  return (
    <div className={`post dark-32-${dark} ${className}`}>
      <div className="main-4">
        <div className="data">
          <div className="post-avatar-wrap">
            <Avatar
              username={text1}
              profilepicture={profilepicture}
              alt={`${text1}'s profile picture`}
              className="post-image"
            />
            <span className="post-status-dot" />
          </div>
          <div className="data-2">
            <div className="title-3">
              {isEditingPost ? (
                <textarea
                  className="post-edit-input"
                  value={postText}
                  onChange={(event) => setPostText(event.target.value)}
                  maxLength="5000"
                  autoFocus
                />
              ) : (
                <p className="bitcoin-has-tumbled">{postText}</p>
              )}
              {(isPostOwner || canDeletePost) && (
                <div className="post-owner-actions">
                  {isEditingPost ? (
                    <>
                      <button type="button" onClick={saveEditedPost} disabled={isSavingPost}>Save</button>
                      <button type="button" onClick={() => { setPostText(text); setIsEditingPost(false); }} disabled={isSavingPost}>Cancel</button>
                    </>
                  ) : (
                    <>
                      {isPostOwner && <button type="button" onClick={() => setIsEditingPost(true)}>Edit post</button>}
                      {canDeletePost && <button type="button" className="delete-post-button" onClick={deletePost} disabled={isSavingPost}>Delete post</button>}
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="user">
              <div className="name-3">
                <div className="name-4">
                  <div className="name-5">
                    <div className="pavel-gvay">{text1}</div>
                  </div>
                  <div className="element-weeks-ago">{formattedDate}</div>
                </div>
                <div className="action">
                  <div className="element-likes">
                    {localLikeCount === 1 ? "1 like" : localLikeCount > 1 ? `${localLikeCount} likes` : "0 likes"}
                  </div>
                  <div className="element-comments">
                    {localComments.length === 1 ? "1 comment" : `${localComments.length} comments`}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="love" onClick={handleLikeClick}>
            <IconLike
              className={iconLikeIconLikeClassName}
              heartClassName={iconLikeHeartClassName}
              style={{ cursor: "pointer" }}
              isLiked={isLiked}
              fillColor={isLiked ? "#FE4401" : "transparent"}
            />
          </div>
        </div>
      </div>
      <div className="post-comments-section">
        <div className="post-comments-list">
          {localComments.map((c, idx) => {
            const key = commentKey(c, idx);
            const isEditing = editingCommentId === key;
            const canEdit = ownsComment(c);
            const canDelete = canEdit || userInfo?.role === "admin";

            return (
            <div key={key} className="post-comment-item">
              <span className="post-comment-author">{c.userName}:</span>
              {isEditing ? (
                <input
                  className="post-comment-edit-input"
                  value={editingCommentText}
                  onChange={(event) => setEditingCommentText(event.target.value)}
                  maxLength="1000"
                  autoFocus
                />
              ) : (
                <span className="post-comment-text">{c.text}</span>
              )}
              <span className="post-comment-date">
                {c.createdAt ? new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: "short" }).format(new Date(c.createdAt)) : ""}
              </span>
              {(canEdit || canDelete) && (
                <span className="post-comment-actions">
                  {isEditing ? (
                    <>
                      <button type="button" onClick={() => saveEditedComment(c, idx)} disabled={commentActionId === key}>Save</button>
                      <button type="button" onClick={() => { setEditingCommentId(null); setEditingCommentText(""); }} disabled={commentActionId === key}>Cancel</button>
                    </>
                  ) : (
                    <>
                      {canEdit && <button type="button" onClick={() => { setEditingCommentId(key); setEditingCommentText(c.text); }}>Edit</button>}
                      {canDelete && <button type="button" className="delete-comment-button" onClick={() => deleteComment(c, idx)} disabled={commentActionId === key}>Delete</button>}
                    </>
                  )}
                </span>
              )}
            </div>
            );
          })}
        </div>
        <form onSubmit={handleAddComment} className="post-comment-form">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="post-comment-input"
            disabled={isSubmittingComment}
          />
          <button type="submit" className="post-comment-btn" disabled={!commentText.trim() || isSubmittingComment}>
            {isSubmittingComment ? "..." : "Comment"}
          </button>
        </form>
      </div>
    </div>
  );
};

Post.propTypes = {
  dark: PropTypes.oneOf(["off", "on"]),
  text: PropTypes.string,
  text1: PropTypes.string,
  text2: PropTypes.string,
  text3: PropTypes.string,
  text4: PropTypes.string,
  iconLikeIconLikeClassName: PropTypes.object,
  iconLikeHeartClassName: PropTypes.object,
};
