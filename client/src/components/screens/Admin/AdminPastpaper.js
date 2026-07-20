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
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const backToHome = () => {
    navigate('/home');
  };

  const handleDelete = async (paperToDelete) => {
    try {
      setDeletingId(paperToDelete._id);
      const response = await fetch(`http://localhost:8080/api/pastpapers`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({id : paperToDelete._id}),
      });

      if (response.ok) {
        setData((prevData) => prevData.filter((paper) => paper._id !== paperToDelete._id));
      } else {
        console.error('Error deleting paper:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting paper:', error);
    } finally {
      setDeletingId(null);
      setSelectedPaper(null);
    }
  };

  // Call the fetchData function when the component is loaded
  useEffect(() => {
    const fetchDataAndSetData = async () => {
      const result = await fetchData();
      if (result) {
        setData(result);
      }
      setIsLoading(false);
    };
    fetchDataAndSetData();
  }, [fetchDataFlag]);

  return (
    <>
      <Header page="pp"></Header>

      <main className="admin-past-papers-page">
        <button className="admin-papers-back" onClick={backToHome}>
          ← Back to home
        </button>

        <section className="admin-papers-heading">
          <div>
            <p className="admin-papers-eyebrow">Admin library</p>
            <h1>Learning resources</h1>
            <p>Review and remove resources that are no longer needed.</p>
          </div>
          <div className="admin-papers-count">{data.length} {data.length === 1 ? 'resource' : 'resources'}</div>
        </section>

        <div className="admin-past-papers-table-wrap">
          <table className="admin-past-papers-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Date</th>
                <th>Link</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" className="admin-papers-empty">Loading past papers…</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="6" className="admin-papers-empty">No past papers have been added yet.</td></tr>
              ) : data.map((paper, index) => {
                const isValidDate = !!paper.date && !isNaN(Date.parse(paper.date));
                const formattedDate = isValidDate
                  ? (() => {
                      const dateObject = new Date(paper.date);
                      return `${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject
                        .getDate()
                        .toString()
                        .padStart(2, '0')}-${dateObject.getFullYear()}`;
                    })()
                  : '—';

                return (
                  <React.Fragment key={paper._id || index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{paper.name}</td>
                      <td>{formattedDate}</td>
                      <td>
                        <a className="paper-link" target='_blank' href={paper.link} rel="noreferrer">
                          Open paper ↗
                        </a>
                      </td>
                      <td><span className="paper-kind">{paper.kind || 'Uncategorized'}</span></td>
                      <td className="admin-paper-actions">
                        <button className="manage-paper-button" onClick={() => setSelectedPaper(selectedPaper?._id === paper._id ? null : paper)}>
                          {selectedPaper?._id === paper._id ? 'Close' : 'Manage'}
                        </button>
                      </td>
                    </tr>

                    {selectedPaper?._id === paper._id && (
                      <tr className="paper-manage-row">
                        <td colSpan="6">
                          <div className="edit-options">
                            <div>
                              <strong>Remove “{paper.name}”?</strong>
                              <span>This action cannot be undone.</span>
                            </div>
                            <div className="edit-options-actions">
                              <button className="cancel-paper-button" onClick={() => setSelectedPaper(null)}>Cancel</button>
                              <button className="delete-paper-button" onClick={() => handleDelete(paper)} disabled={deletingId === paper._id}>
                                {deletingId === paper._id ? 'Deleting…' : 'Delete paper'}
                              </button>
                            </div>
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
      </main>
    </>
  );
};

export default PastPapers;
