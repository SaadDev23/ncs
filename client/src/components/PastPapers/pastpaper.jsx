import React, { useEffect, useState } from 'react';
import './pastpaper.css'
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
const fetchData = async () => {
    try {
        const response = await fetch("http://localhost:8080/api/pastpapers");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
const PastPapers = () => {
    const [data, setData] = useState([]);
    const [fetchDataFlag, setFetchDataFlag] = useState(true); // State to trigger data fetching
    const navigate = useNavigate();


    const backToHome = () => {
        navigate('/home');
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

        <div className="past-papers-page">
            <button id='back' onClick={backToHome}>
                Back to Home
            </button>

            <div className="past-papers-table-wrap">
                <table className="past-papers-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Link</th>
                            <th>Scope</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((paper, index) => {
                            const isValidDate = !!paper.date && !isNaN(Date.parse(paper.date));

                            // If it's a valid date, format it; otherwise, display an empty string
                            const formattedDate = isValidDate
                                ? (() => {
                                    const dateObject = new Date(paper.date);
                                    return `${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}-${dateObject.getFullYear()}`;
                                })()
                                : '';
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{paper.name}</td>
                                    <td>{formattedDate}</td>
                                    <td>
                                        <a target='_blank' href={paper.link} rel="noreferrer">
                                            {paper.link}
                                        </a>
                                    </td>
                                    <td>{paper.kind}</td>
                                </tr>
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
