import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { Avatar } from "../Avatar/Avatar";
import "./style.css";
import { toast } from "react-toastify";

export const CreatPost = ({
  dark,
  className,
  onPostCreated,
  profilepicture,
}) => {
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const imageInputRef = useRef(null);

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/me", {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
        const { sessionUser } = result;

        console.log(`in create post ${JSON.stringify(sessionUser)}`);
        setUserInfo(sessionUser); // Assuming the user information is under the key 'userInfo'
      } catch (error) {
        console.error("Error Fetching User data", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handlePostContentChange = (event) => {
    setPostContent(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Please choose an image smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPostImage(String(reader.result));
    reader.onerror = () => toast.error("Unable to read that image.");
    reader.readAsDataURL(file);
  };

  const handleCreatePost = async () => {
    if (!userInfo) {
      toast.error("Please log in before creating a post.");
      return;
    }
    if (!postContent.trim() && !postImage) {
      toast.error("Write something or add an image before posting.");
      return;
    }

    const data = {
      userId: userInfo.id,
      userName: userInfo.username,
      description: postContent.trim(),
      image: postImage,
    };

    setIsCreating(true);
    try {
      const response = await fetch("http://localhost:8080/posts/postcreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        setPostContent("");
        setPostImage("");
        if (imageInputRef.current) imageInputRef.current.value = "";
        navigate(0);
        if (onPostCreated) {
          onPostCreated();
        }
      } else {
        const result = await response.json().catch(() => ({}));
        toast.error(result.error || result.message || "Unable to create post.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Unable to create post. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={`creat-post dark-30-${dark} ${className}`}>
      <div className="main-3">
        <div className="abatars">
          <Avatar
            username={userInfo?.username}
            profilepicture={userInfo?.profilepicture}
            alt="Profile"
            className="abatars"
          />
        </div>
        <TextareaAutosize
          className="input-data"
          placeholder="Let’s share what's going on your mind..."
          value={postContent}
          onChange={handlePostContentChange}
          minRows={1}
          maxRows={10}
        />
        <button
          type="submit"
          className="text-wrapper-3 button"
          onClick={handleCreatePost}
          disabled={isCreating}
        >
          {isCreating ? "Posting..." : "Create"}
        </button>
      </div>
      <div className="post-image-tools">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="post-image-input"
        />
        <button
          type="button"
          className="add-image-button"
          onClick={() => imageInputRef.current?.click()}
          disabled={isCreating}
        >
          Add Photo
        </button>
        {postImage && (
          <div className="post-image-preview-wrap">
            <img className="post-image-preview" src={postImage} alt="Selected post" />
            <button
              type="button"
              className="remove-image-button"
              onClick={() => {
                setPostImage("");
                if (imageInputRef.current) imageInputRef.current.value = "";
              }}
              disabled={isCreating}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

CreatPost.propTypes = {
  dark: PropTypes.oneOf(["off", "on"]),
  onPostCreated: PropTypes.func,
};
