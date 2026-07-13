import React, { useEffect, useState } from 'react';
import './AdminPastpaper.css';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../Header/';

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/pastpapers');
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const PastPapers = () => {
  const [data, setData] = useState([]);
  const [fetchDataFlag, setFetchDataFlag] = useState(true); // State to trigger data fetching
  const [selectedPaper, setSelectedPaper] = useState(null);
  const navigate = useNavigate();

  const backToHome = () => {
    navigate('/home');
  };

  const handleDelete = async (paperToDelete) => {
    try {
        console.log(`paperToDelete id is ${paperToDelete._id}`);
        // const id = paperToDelete._id
      const response = await fetch(`http://localhost:8080/api/pastpapers`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({id : paperToDelete._id}),
      });

      if (response.ok) {
        // Remove the deleted paper from the data state
        setData((prevData) => prevData.filter((paper) => paper.id !== paperToDelete.id));
        navigate(0)
      } else {
        console.error('Error deleting paper:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting paper:', error);
    }

    // Clear the selectedPaper state
    setSelectedPaper(null);
  };

  // Call the fetchData function when the component is loaded
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

  return (
    <>
      <Header page="pp"></Header>

      <div className="admin-past-papers-page" style={{ backgroundColor: '#1E252B', minHeight: '100vh', padding: '20px' }}>
        <button id="back" onClick={backToHome}>
          Back to Home
        </button>

        <div className="admin-past-papers-table-wrap" style={{ width: '80%', margin: '0 auto' }}>
          <table className="admin-past-papers-table" style={{ width: '100%', borderCollapse: 'collapse', color: 'white', lineHeight: '50px' }}>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Date</th>
                <th>Link</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((paper, index) => {
                const isValidDate = !!paper.date && !isNaN(Date.parse(paper.date));
                const formattedDate = isValidDate
                  ? (() => {
                      const dateObject = new Date(paper.date);
                      return `${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject
                        .getDate()
                        .toString()
                        .padStart(2, '0')}-${dateObject.getFullYear()}`;
                    })()
                  : '';

                return (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{paper.name}</td>
                      <td>{formattedDate}</td>
                      <td>
                        <a target='_blank' href={paper.link} style={{ color: 'white', textDecoration: 'none' }} rel="noreferrer">
                          {paper.link}
                        </a>
                      </td>
                      <td>{paper.kind}</td>
                      <td>
                        <button onClick={() => setSelectedPaper(paper)}>Edit</button>
                      </td>
                    </tr>

                    {selectedPaper && selectedPaper.id === paper.id && (
                      <tr>
                        <td colSpan="5"> {/* Span across all columns */}
                          <div className="edit-options">
                            <button onClick={() => setSelectedPaper(null)}>Cancel</button>
                            <button onClick={() => handleDelete(selectedPaper)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PastPapers;
