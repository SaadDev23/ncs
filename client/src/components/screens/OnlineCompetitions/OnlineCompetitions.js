import React, { useEffect, useState } from "react";
import { Header } from "../../Header";
import { Meetups } from "../../Meetups";
import "./onlineCompetitions.css";

export default function OnlineCompetitions() {
  const [competitions, setCompetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCompetitions() {
      try {
        const response = await fetch("http://localhost:8080/api/competitions");
        if (!response.ok) throw new Error("Unable to load online competitions.");
        setCompetitions(await response.json());
      } catch (requestError) {
        console.error("Error fetching online competitions:", requestError);
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadCompetitions();
  }, []);

  return (
    <>
      <Header page="competitions" />
      <main className="online-competitions-page">
        <div className="online-competitions-heading">
          <p>Competition directory</p>
          <h1>Online Competitions</h1>
          <span>Explore every available online coding opportunity in one place.</span>
        </div>

        {isLoading ? (
          <p className="online-competitions-state">Loading competitions...</p>
        ) : error ? (
          <p className="online-competitions-state">{error}</p>
        ) : competitions.length === 0 ? (
          <p className="online-competitions-state">No online competitions are available yet.</p>
        ) : (
          <div className="online-competitions-grid">
            {competitions.map((competition) => (
              <Meetups
                key={competition._id || competition.id}
                kind={competition.kind}
                date={competition.date}
                text1={competition.title}
                text2={competition.location}
                link={competition.link}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
