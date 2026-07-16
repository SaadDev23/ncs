import React, { useEffect, useState } from "react";
import { CreatPost } from "../../CreatPost";
import { Design } from "../../Design";
// import { IconLike } from "../../IconLike";
import { Meetups } from "../../Meetups";
import { PinnedGroup } from "../../PinnedGroup";
import { PopularTags } from "../../PopularTags";
import { Header } from "../../Header";
import { Post } from "../../Post";
import { HackerNews } from "../../HackerNews/HackerNews";
import "./homepage.css";

export default function Main() {
  const [posts, setPosts] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [onSiteCompetitions, setonSiteCompetitions] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(true);
  const [, setUser] = useState()
  useEffect(() => {
    // Fetch posts
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/posts"); // Update URL to your posts API
        const result = await response.json();
        console.log("Fetched posts:", result); // Add this log
        setPosts(result);
        console.log(result)
        setIsLoadingPosts(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsLoadingPosts(false);
      }
    };


    // Fetch competitions
    const fetchCompetitions = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/competitions");
        const result = await response.json();
        setCompetitions(result);
        setIsLoadingCompetitions(false);
      } catch (error) {
        console.error("Error fetching competitions:", error);
        setIsLoadingCompetitions(false);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/me", {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        // const { me } = result;
        console.log(`result is ${JSON.stringify(result)}`)
        // console.log(result)
        // console.log(response.json())
        setUser(response);

      } catch (error) {
        console.error('Error Fetching User data', error)
      }
    }
    const fetchOnSiteCompeitions = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/get-onsite-competitions");
        const result = await response.json();
        console.log(result)
        setonSiteCompetitions(result);
        setIsLoadingCompetitions(false);
      } catch (error) {
        console.error("Error fetching competitions:", error);
        setIsLoadingCompetitions(false);
      }
    };

    // Call both fetch functions when the component mounts
    fetchPosts();
    fetchCompetitions();
    fetchOnSiteCompeitions()
    fetchUser();
  }, []);

  return (
    <>
      <Header page="home"></Header>
      <main className="dashboard-layout">
        <aside className="sidebar-left">
          <div className="meetups dark-46-on">
            <div className="text-wrapper-9">
              <a href="/register-competition">Onsite Registrations</a>
            </div>
            {isLoadingCompetitions ? (
              <p>Loading competitions...</p>
            ) : (
              <div>
                {onSiteCompetitions.map((item) => (
                  <PopularTags
                    key={item._id || item.id}
                    className="design-component-instance-node"
                    dark="on"
                    text="Registrations"
                    date={item.date}
                    text1={item.title}
                    text2={item.max_registerations}
                    text3={item.registerations_completed}
                    text4={item.location}
                  />
                ))}
              </div>
            )}
          </div>
          <PinnedGroup
            className="design-component-instance-node"
            dark="on"
            icon={<Design />}
            text="Rankings"
          />
        </aside>

        <section className="feed-main">
          <CreatPost className="design-component-instance-node" dark="on" />
          <div className="main-wrapper">
            {isLoadingPosts ? (
              <p>Loading posts...</p>
            ) : (
              <div>
                {posts.map((item) => (
                  <Post
                    key={item._id}
                    profilepicture={item.profilepicture}
                    postImage={item.image}
                    idd={item._id}
                    postUserId={item.userId}
                    dark="on"
                    text={item.description}
                    text1={item.userName}
                    text2={item.createdAt}
                    text3={item.likes}
                    text4={item.comments?.length ?? 0}
                    comments={item.comments || []}
                    onPostUpdated={(updatedPost) => {
                      if (!updatedPost) return;
                      setPosts((currentPosts) => currentPosts.map((post) =>
                        post._id === updatedPost._id ? { ...post, ...updatedPost } : post,
                      ));
                    }}
                    onPostDeleted={(postId) => {
                      setPosts((currentPosts) => currentPosts.filter((post) => post._id !== postId));
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="sidebar-right">
          <div className="meetups dark-46-on">
            <div className="text-wrapper-9">Online Competitions</div>
            {isLoadingCompetitions ? (
              <p>Loading competitions...</p>
            ) : (
              <div>
                {competitions.map((item) => (
                  <Meetups
                    key={item.id}
                    kind={item.kind}
                    date={item.date}
                    text1={item.title}
                    text2={item.location}
                    link={item.link}
                  />
                ))}
              </div>
            )}
          </div>
          <HackerNews />
        </aside>
      </main>
    </>
  );
}
