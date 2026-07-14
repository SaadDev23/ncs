import React, { useState, useEffect } from "react";
import { Meetups } from "../../Meetups";
import { Bitcoin3 } from "../../../icons/Bitcoin3";
import "./admin.css";
import MyModal from "../../Modal/modal";
import MyModal2 from "../../Modal/regModal";
import { Vector173 } from "../../../icons/Vector173";
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { Header } from '../../Header';


const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/competitions");
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default function Admin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(true);
  const [isOnSiteModalOpen, setIsOnSiteModalOpen] = useState(false); 
  const [data, setData] = useState([]);
  const [fetchDataFlag, setFetchDataFlag] = useState(true); // State to trigger data fetching
  const [modalMode, setModalMode] = useState(""); // State to store the modal mode
  const [userInfo, setUserInfo] = useState(null);
  const [onSiteCompetitions, setonSiteCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [registrationEntries, setRegistrationEntries] = useState([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);

  const navigate = useNavigate() 

  useEffect(() => {
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

    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/me", {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        const { sessionUser } = result
        setUserInfo(sessionUser); // Assuming the user information is under the key 'userInfo'
        if(sessionUser.role !== 'admin'){
          navigate('/login')
          toast.warning("Unauthorized")
          throw new Error('Unauthorized')
        }
      } catch (error) {
        console.error(error.message);
        // navigate()
      }
    };

    fetchUserInfo();
    fetchOnSiteCompeitions()
  }, []);
  useEffect(() => {
    const fetchDataAndSetData = async () => {
      const result = await fetchData();
      if (result) {
        setData(result);
        setFetchDataFlag(false);
        console.log(result);
      }
    };
    fetchDataAndSetData();
  }, [fetchDataFlag]);

  const openModal = (mode) => {
    setModalMode(mode);
    if (mode === "onsite-competition") {
      setIsOnSiteModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsOnSiteModalOpen(false);

  };

  const viewRegistrationEntries = async (competition) => {
    setSelectedCompetition(competition);
    setIsLoadingEntries(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/onsite-competition-registrations?title=${encodeURIComponent(competition.title)}`,
        { credentials: "include" },
      );

      if (!response.ok) {
        throw new Error("Could not load registrations");
      }

      setRegistrationEntries(await response.json());
    } catch (error) {
      console.error("Error fetching registration entries:", error);
      setRegistrationEntries([]);
      toast.error("Could not load registration entries");
    } finally {
      setIsLoadingEntries(false);
    }
  };

  const handleModalSubmit = async (competitionData) => {
    // Perform actions with the competitionData (e.g., send it to your API)
    console.log("Competition Data:", competitionData);
    let url = modalMode === "competition" ? "admin-uc" : "pastpapers";
    if (modalMode === "onsite-competition") {
      url = "register-onsite-competition";
    }
    try {
      const response = await fetch("http://localhost:8080/api/" + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(competitionData),
      });

      if (response.ok) {
        // Data sent successfully
        console.log("Competition Upload Successful");
        setFetchDataFlag(true);
        const index = data.findIndex((item) => item.id === competitionData.id);

      // Update the selectedTag for the specific competition
      setData((prevData) => [
        ...prevData.slice(0, index),
        { ...prevData[index], kind: competitionData.kind },
        ...prevData.slice(index + 1),
      ]);
      if(modalMode == "competition")
      toast.success("Competition Upload Successful",{
        position : "top-center",
        autoClose :200
      })
      else
      toast.success("Past Paper Upload Successful",{
        position : "top-center",
        autoClose :200
      })

      setTimeout(() =>{
        navigate(0)
      },1500)

    } else {
      // Handle errors
      const errorMessage = await response.text(); // Get the error message from the response
      // console.error("Competition Upload Failed:", errorMessage);
      if(modalMode == "competition")
      toast.error("Error in Uploading Compeition",{
        position : "top-center",
        autoClose :200
      })
      else
      toast.error("Error in Uploading Past Paper",{
        position : "top-center",
        autoClose :200
      })
      
      setTimeout(() =>{
        navigate(0)
      },1500)
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
const handleModal2Submit = async (competitionData) => {
  // Perform actions with the competitionData (e.g., send it to your API)
    console.log("Competition Data:", competitionData);
    const url = "admin-onsite-competition";
  try {
    const response = await fetch("http://localhost:8080/api/" + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(competitionData),
    });

    if (response.ok) {
      // Data sent successfully
      console.log("Onsite Competition Upload Successful");
      setFetchDataFlag(true);
      const index = data.findIndex((item) => item.id === competitionData.id);

    // Update the selectedTag for the specific competition
    setData((prevData) => [
      ...prevData.slice(0, index),
      ...prevData.slice(index + 1),
    ]);
    toast.success(`Competition Upload Successful`,{
      position : "top-center",
      autoClose :200
    })
    setTimeout(() =>{
      navigate(0)
    },1500)

  } else {
    // Handle errors
    const errorMessage = await response.text(); // Get the error message from the response
    console.error("Competition Upload Failed:", errorMessage);
    toast.error("Error in Uploading Compeition",{
      position : "top-center",
      autoClose :200
    })
    setTimeout(() =>{
      navigate(0)
    },1500)
  }
} catch (error) {
  console.error("Error:", error);
}
};

  return (
    <>
      <Header page="dashboard"></Header>
    <>
      <MyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        mode={modalMode} // Pass the modal mode as a prop
      />
       <MyModal2
        isOpen={isOnSiteModalOpen}
        onClose={closeModal}
        onSubmit={handleModal2Submit}
        mode={modalMode}
      />
      <div id="admin" className="admin-dashboard">
        <aside className="admin-actions">
          <p className="admin-eyebrow">Dashboard</p>
          <h1>Manage content</h1>
          <p className="admin-copy">Create competitions, past papers, and on-site events from one place.</p>
          <button
            type="button"
            className="button text-wrapper-3"
            onClick={() => openModal("competition")} // Specify the mode when clicking "Upload Competition"
          >
            Upload Competition
          </button>
          <button
            type="button"
            className="button text-wrapper-3"
            onClick={() => openModal("pastpaper")} // Specify the mode when clicking "Add Pastpaper"
          >
            Add Pastpaper
          </button>
          <button
            type="button"
            className="button text-wrapper-3"
            onClick={() => openModal("onsite-competition")} // Specify the mode when clicking "Upload on Site Competition"
          >
            Upload On-Site Competition
          </button>
        </aside>

        <section className="admin-primary">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">On-site registrations</p>
              <h2>Competition entries</h2>
            </div>
            <a href="/register-competition">View public page</a>
          </div>
          {isLoadingCompetitions ? (
            <p className="admin-empty">Loading competitions...</p>
          ) : onSiteCompetitions.length === 0 ? (
            <p className="admin-empty">No on-site competitions yet.</p>
          ) : (
            <div className="onsite-competitions-list">
              {onSiteCompetitions.map((item) => (
                <div className="onsite-competition-item" key={item._id}>
                  <div>
                    <strong>{item.title}</strong>
                    <div className="onsite-competition-meta">
                      {item.registerations_completed} / {item.max_registerations} registrations
                    </div>
                  </div>
                  <button type="button" className="view-entries-button" onClick={() => viewRegistrationEntries(item)}>
                    View entries
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedCompetition && (
            <div className="registration-entries-panel">
              <div className="registration-entries-header">
                <div>
                  <p className="admin-eyebrow">Registration entries</p>
                  <strong>{selectedCompetition.title}</strong>
                </div>
                <button type="button" onClick={() => setSelectedCompetition(null)}>Close</button>
              </div>

              {isLoadingEntries ? (
                <p className="admin-empty">Loading entries...</p>
              ) : registrationEntries.length === 0 ? (
                <p className="admin-empty">No registrations yet.</p>
              ) : (
                <div className="registration-entries-table-wrap">
                  <table className="registration-entries-table">
                    <thead><tr><th>#</th><th>Team</th><th>Member 1</th><th>Member 2</th><th>Member 3</th><th>Phone</th></tr></thead>
                    <tbody>
                      {registrationEntries.map((entry, index) => (
                        <tr key={entry._id}>
                          <td>{index + 1}</td><td>{entry.team_name}</td><td>{entry.member1}</td>
                          <td>{entry.member2}</td><td>{entry.member3}</td><td>{entry.phone_number}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>

        <aside className="right-bar">
          <div id="comp" className="meetups dark-46-on design-component-instance-node">
            <div className="main-5">
              <div className="title-4">
                <div className="text-wrapper-9">Upcoming Competitions</div>
                <Vector173 className="vector-17-3" color="#F7F7F7" />
              </div>
              <ul>
                {data.map((item) => (
                  <Meetups
                    date={item.date}
                    text1={item.title}
                    text2={item.location}
                    kind={item.kind} // Pass the type here instead of selectedTag
                    key={item.id}
                    link={item.link}
                  ></Meetups>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </>
  </>
  );
}
