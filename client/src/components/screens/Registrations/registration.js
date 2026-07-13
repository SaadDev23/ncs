import React, { useEffect, useState } from "react";
import RegisterationModal from "../../Modal/userRegisterationModal";
import { Header } from "../../Header";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";




export default function RegistrationPage() {
  const [registerations, setRegisterations] = useState([]);
  const [data, setData] = useState([]);
  const [isRegisterationModalOpen, setIsRegisterationModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingRegisterations, setIsLoadingRegisterations] = useState(true);
  const [fetchDataFlag, setFetchDataFlag] = useState(true); // State to trigger data fetching
  const navigate = useNavigate();
  const [userinfo, setUserInfo] = useState("")
  const [modalMode, setModalMode] = useState(""); // State to store the modal mode
  const [user, setUser] = useState()

  let role;
  useEffect(() => {
    // Fetch registerations
    const fetchOnsiteCompetition = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/get-onsite-competitions"); // Update URL to your registerations API
        const result = await response.json();
        console.log("Fetched registerations:", result); // Add this log
        setRegisterations(result);
        console.log(result)
        setIsLoadingRegisterations(false);
      } catch (error) {
        console.error("Error fetching registerations:", error);
        setIsLoadingRegisterations(false);
      }
    };
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/me", {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        const { sessionUser } = result
        setUserInfo(sessionUser)
        setUser(result);
        console.log(sessionUser)
        console.log(userinfo)
        if (!sessionUser) {
          toast.warning("your session is ended")
          navigate('/login')
        }
      } catch (error) {
        console.error('Error Fetching User data', error)
      }
    }

    fetchOnsiteCompetition();
    fetchUser();
  }, []);
  const openModal = (mode) => {
    console.log(mode)

    setModalMode(mode);
    if (mode === "register-onsite-competition") {
      setIsRegisterationModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };
  const deleteOnsiteCompetition = async (id) => {
    try {
      const data = {
        id
      }
      const response = await fetch("http://localhost:8080/api/delete-onsite-competition", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: 'include',
      }); // Update URL to your registerations API
      if (response.ok) {
        toast.success("Post Deleted", {
          position: "top-center",
          autoClose: 1000,
        })
      }
      else {
        toast.error('Could not delete Competition', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "colored"
        });
      }
      setTimeout(() => {
        navigate(0)
      }, 1000)
    } catch (error) {
      console.error("Error fetching registerations:", error);
      setIsLoadingRegisterations(false);
    }

  }

  const closeModal = () => {
    setIsRegisterationModalOpen(false);
    setIsModalOpen(false);

  };
  const handleRegisterationModalSubmit = async (registerationData) => {
    console.log(registerationData)
    // Perform actions with the registerationData (e.g., send it to your API)
    console.log("Registeration Data:", registerationData);
    const url = "register-onsite-competition";
    try {
      const response = await fetch("http://localhost:8080/api/" + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerationData),
      });

      if (response.ok) {
        // Data sent successfully
        console.log("Registered Successfully");
        setFetchDataFlag(true);
        const index = data.findIndex((item) => item.id === registerationData.id);

        // Update the selectedTag for the specific competition
        setData((prevData) => [
          ...prevData.slice(0, index),
          ...prevData.slice(index + 1),
        ]);
        toast.success("Registered Successfully")
        setTimeout(() => {
          navigate(0);
        }, 1000);

      } else {
        // Handle errors
        const errorResponse = await response.json(); // Try to parse the response as JSON
        toast.error(errorResponse.error, {
          position: "top-right",
          autoClose: true,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "colored"
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored"
      })
      console.error("Error2:", error);
    }
  };

  return (
    <>
      <>
        <RegisterationModal
          isOpen={isRegisterationModalOpen}
          onClose={closeModal}
          onSubmit={handleRegisterationModalSubmit}
          mode={modalMode} // Pass the modal mode as a prop
        />
      </>
      <Header page="rh"></Header>
      <div className="register">
        <div className="text-wrapper">🏆 On-site Competitions</div>
        <div className="table">
          <div className="ranking">
            <div className="frame">
              <div className="div">Register Now!</div>
              <div className="frame-2">
                <div className="text-wrapper-2">Registrations Completed</div>
                <div className="text-wrapper-2">Registrations Left</div>
              </div>
            </div>
            {registerations.map((item) => (
              <div className="standing">
                <div className="club">
                  <div className="text-wrapper-3">*</div>
                  <img className="logo" alt="Chelsea Logo" src="/imgHome/rectangle-32-5.png" />
                  <div className="text-wrapper-4" style={{ color: (item.max_registerations - item.registerations_completed) < 10 ? "red" : "white" }}>{item.title}</div>
                  <div style={{ color: "red", cursor: "pointer" }} onClick={() => openModal("register-onsite-competition")} >Register Now</div>
                </div>
                <div className="poin">
                  <div className="text-wrapper-2" style={{ color: (item.max_registerations - item.registerations_completed) < 10 ? "red" : "white" }}>{item.registerations_completed}</div>
                  <div className="text-wrapper-2" style={{ color: (item.max_registerations - item.registerations_completed) < 10 ? "red" : "white" }}>{item.max_registerations - item.registerations_completed}</div>
                  {/* <div> */}
                  {userinfo && userinfo.role === "admin" && (
                    <div
                      style={{ marginRight: "-25px", color: "red", cursor: "pointer" }}
                      onClick={() => deleteOnsiteCompetition(item._id)}
                    >
                      delete
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
