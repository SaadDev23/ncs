import "./style.css";
import { Header } from "../../Header";
import { Avatar } from "../../Avatar/Avatar";
import { Post } from "../../Post";
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


const ProfileEditModal = ({ onClose, onSave }) => {
  const [updatedAboutMe, setUpdatedAboutMe] = useState('');

  const handleSave = () => {
    onSave(updatedAboutMe);
    onClose();
  };

  return (
    <div className="profile-edit-modal">
      <h3 style={{color:"white"}}>Edit 'About Me'</h3>
      <input
        type="text"
        value={updatedAboutMe}
        onChange={(e) => setUpdatedAboutMe(e.target.value)}
        placeholder="Enter your updated 'About Me'"
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default function Box() {
  const [userInfo, setUserInfo] = useState(null);
  const [sessionUser, setSessionUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedSection, setSelectedSection] = useState("aboutMe");
  const [isEditingAboutMe, setIsEditingAboutMe] = useState(false);
  const { userId } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const sessionResponse = await fetch("http://localhost:8080/api/me", {
          method: 'GET',
          credentials: 'include'
        });
        const sessionResult = await sessionResponse.json();
        const currentUser = sessionResult.sessionUser;
        setSessionUser(currentUser);

        const profileId = userId || currentUser?.id;
        if (!profileId) throw new Error("Unable to identify this user.");

        const userResponse = await fetch(
          `http://localhost:8080/users/${encodeURIComponent(profileId)}`,
          { credentials: 'include' },
        );
        const userResult = await userResponse.json().catch(() => ({}));
        if (!userResponse.ok) throw new Error(userResult.message || "Unable to load this profile.");
        const selectedUser = {
          ...userResult,
          id: userResult._id,
          profilepicture: userResult.profilePicture,
        };

        const postsResponse = await fetch("http://localhost:8080/posts");
        const postsResult = await postsResponse.json().catch(() => []);
        if (!postsResponse.ok) throw new Error("Unable to load this user's posts.");

        setUserInfo(selectedUser);
        setUserPosts(
          (Array.isArray(postsResult) ? postsResult : []).filter(
            (post) => String(post.userId) === String(profileId),
          ),
        );
      } catch (error) {
        console.error('Error Fetching User data', error);
        setLoadError(error.message || "Unable to load this profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const isOwnProfile =
    sessionUser?.id && userInfo?.id && String(sessionUser.id) === String(userInfo.id);

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];

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

    try {
      const base64Image = await convertImageToBase64(file);
      await updateProfilePicture(base64Image);
    } catch (error) {
      console.error("Error handling profile picture change:", error);
      toast.error(error.message || "Unable to upload profile picture.");
    } finally {
      event.target.value = "";
    }
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result.split(",")[1]); // Extract base64 data
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  const updateProfilePicture = async (base64Image) => {
    if (!userInfo?.id) {
      throw new Error("Please log in again before changing your profile picture.");
    }

    try {
      const response = await fetch("http://localhost:8080/api/update-profile-picture", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId: userInfo.id, profilePicture: base64Image }),
      });

      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        setUserInfo((currentUser) => ({
          ...currentUser,
          profilepicture: result.profilePicture || base64Image,
        }));
        toast.success("Profile picture updated successfully",{
          autoClose : 200,
          hideProgressBar: true,
          position:"top-center"
        })
        return;
      } else {
        throw new Error(result.error || "Failed to update profile picture.");
      }
    } catch (error) {
      console.error('Error updating profile picture', error);
      throw error;
    }
  };

  const editProfile = async () => {
    setIsEditingAboutMe(true);
  };

  const saveUpdatedAboutMe = async (updatedAboutMe) => {
    try {
      const response = await fetch("http://localhost:8080/api/update-profile", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId: userInfo.id, aboutMe: updatedAboutMe }),
      });

      if (response.ok) {
        setUserInfo({
          ...userInfo,
          aboutme: updatedAboutMe,
        });

        console.log('Profile updated successfully');
        toast.success("Profile Updated successfully",{
          position: "top-center"
        })
      } else {
        console.error('Failed to update profile');
        toast.error('Failed to update profile', {
          position: "top-center",
          autoClose: 200,
          hideProgressBar: true,
          closeOnClick: true,
          theme: "colored"
        });

      }
    } catch (error) {
      console.error('Error updating profile', error);
    } finally {
      setIsEditingAboutMe(false);
    }
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const renderSectionContent = () => {
    switch (selectedSection) {
      case "aboutMe":
        return (
          <>
            <div className="text-wrapper-4">ABOUT ME</div>
            <p className="about">{userInfo?.aboutme || "No bio has been added yet."}</p>
            <div className="profile-public-details">
              <span><strong>Name:</strong> {[userInfo?.firstName, userInfo?.lastName].filter(Boolean).join(" ") || userInfo?.username}</span>
              <span><strong>Role:</strong> {userInfo?.role || "Member"}</span>
              <span><strong>Location:</strong> {userInfo?.location || "Not provided"}</span>
              <span><strong>Member since:</strong> {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : "Not available"}</span>
            </div>
          </>
        );
      case "teams":
        return (
          <>
            <div className="text-wrapper-7">Team</div>
            {/* Render team information here */}
          </>
        );
      case "stats":
        return (
          <>
            <div className="text-wrapper-8">Stats</div>
            <div className="profile-public-details">
              <span><strong>Posts:</strong> {userPosts.length}</span>
              <span>
                <strong>Comments received:</strong>{" "}
                {userPosts.reduce((total, post) => total + (post.comments?.length || 0), 0)}
              </span>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header page="home"></Header>
      <div className="box">
        {isLoading && <div className="profile-state">Loading profile...</div>}
        {loadError && <div className="profile-state profile-error">{loadError}</div>}
        {!isLoading && !loadError && userInfo && (
        <>
        <div className="profile">
          <div className="change-picture">
          </div>
          <div className="overlap">
            <div className="haha">
              <div className="overlap-group">
                {isOwnProfile && <div id="profile-picture-button">
                  <label htmlFor="profile-picture-input" className="change-picture-label" style={{cursor : "pointer"}}>
                    Change Display
                  </label>
                  <input
                    type="file"
                    id="profile-picture-input"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: "none" }}
                  />
                </div>}
                {isOwnProfile && <div id="update-profile" >
                  <button className='edit-profile' onClick={editProfile}> Update profile
                  </button>
                </div>}
                <div className="rectangle" />
              </div>
              <img className="banner-DDD" alt="Banner DDD" src="/imgProfile/banner-ddd.png" />
            </div>
            <div className="spotfy">
              <img className="c1" alt="c1" src="/imgProfile/image-6.png" />
              <div className="text-wrapper">ICPC</div>
            </div>
            <div className="avatar">
              <Avatar
                username={userInfo?.username}
                profilepicture={userInfo?.profilepicture}
                alt="Avatar"
                className="img"
              />
            </div>
            <div className="nick">
              <div className="div">
                <div className="text-wrapper-2">{userInfo && userInfo.username}</div>
                <div className="text-wrapper-3"></div>
              </div>
            </div>

            <div className="profilee">
              {renderSectionContent()}
            </div>
            <div className="all-line">
              <div className="line-wrapper">
                <img
                  className="line"
                  alt="Line"
                  src="/imgProfile/line-2.svg"
                  style={{ left: selectedSection === 'aboutMe' ? '96px' : selectedSection === 'teams' ? '320px' : '560px' }}
                />
              </div>
              <img className="line-2" alt="Line" src="/imgProfile/line-3.svg" />
            </div>
            <div className="element-text">
              <div
                className={`text-wrapper-6 ${selectedSection === 'aboutMe' ? 'active' : ''}`}
                onClick={() => handleSectionClick("aboutMe")}
              >
                User Info
              </div>
              <div
                className={`text-wrapper-7 ${selectedSection === 'teams' ? 'active' : ''}`}
                onClick={() => handleSectionClick("teams")}
              >
                Team
              </div>
              <div
                className={`text-wrapper-8 ${selectedSection === 'stats' ? 'active' : ''}`}
                onClick={() => handleSectionClick("stats")}
              >
                Stats
              </div>
            </div>
          </div>
        </div>
        <section className="profile-posts-feed">
          <h2>{isOwnProfile ? "Your posts" : `${userInfo.username}'s posts`}</h2>
          {userPosts.length === 0 ? (
            <p className="profile-no-posts">No posts yet.</p>
          ) : (
            userPosts.map((item) => (
              <Post
                key={item._id}
                profilepicture={item.profilepicture || userInfo.profilepicture}
                idd={item._id}
                postUserId={item.userId}
                dark="on"
                text={item.description}
                text1={item.userName || userInfo.username}
                text2={item.createdAt}
                text3={item.likes}
                text4={item.comments?.length ?? 0}
                comments={item.comments || []}
                onPostUpdated={(updatedPost) => {
                  if (!updatedPost) return;
                  setUserPosts((posts) => posts.map((post) =>
                    post._id === updatedPost._id ? { ...post, ...updatedPost } : post,
                  ));
                }}
                onPostDeleted={(postId) => {
                  setUserPosts((posts) => posts.filter((post) => post._id !== postId));
                }}
              />
            ))
          )}
        </section>
        </>
        )}
      </div>
      {isOwnProfile && isEditingAboutMe && (
        <ProfileEditModal onClose={() => setIsEditingAboutMe(false)} onSave={saveUpdatedAboutMe} />
      )}
    </>
  );
}
