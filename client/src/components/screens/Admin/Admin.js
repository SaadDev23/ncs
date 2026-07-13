import React, { useState, useEffect } from "react";
import { Meetups } from "../../Meetups";
import { PopularTags } from "../../PopularTags";
import { Bitcoin3 } from "../../../icons/Bitcoin3";
import "./admin.css";
import MyModal from "../../Modal/modal";
import MyModal2 from "../../Modal/regModal";
import { Vector173 } from "../../../icons/Vector173";
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { AdminHeader } from '../../Header/AdminHeader';


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
      <AdminHeader page="ah"></AdminHeader>
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
      <div id="admin" className="main">
      <div className="div-3">
          <div id="comp" className="meetups dark-46-on design-component-instance-node1">
            <div className="main-5">
              <div className="text-wrapper-9" style={{fontSize : "15px"}}><a href="/register-competition">Onsite Registerations ! </a></div>
            </div>
            {isLoadingCompetitions ? (
              <p>Loading competitions...</p>
            ) : (
              <div>
                {onSiteCompetitions.map((item) => (
                  <PopularTags className="design-component-instance-node"
                    dark="on" text="Registerations !" date={item.date} text1={item.title} text2={item.max_registerations} text3={item.registerations_completed} text4={item.location}/>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="div-3">
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
        </div>

        <div className="right-bar">
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
        </div>
      </div>
    </>
  </>
  );
}
