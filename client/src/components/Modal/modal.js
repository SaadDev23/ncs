import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import "./style.css";

const COMPETITION_CATEGORIES = ["Local", "Regional", "Worldwide"];
const RESOURCE_CATEGORIES = [
  "Past Paper",
  "Lecture Notes",
  "Programming Tutorial",
  "Practice Problems",
  "Interview Preparation",
];

function MyModal({ isOpen, onClose, onSubmit, mode, selectedTag }) {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [kind, setkind] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [selectedTagLocal, setSelectedTagLocal] = useState(selectedTag || ""); // Set the initial value based on the selectedTag prop
  const isCompetition = mode === "competition";
  const categoryOptions = isCompetition
    ? COMPETITION_CATEGORIES
    : RESOURCE_CATEGORIES;

  const handleSubmit = () => {
    const competitionData = {
      name,
      title,
      link,
      location,
      kind,
      date,
      tag: selectedTagLocal, // Include selected tag in the data
    };
    setTitle("");
    setName("");
    setLink("");
    setkind("");
    setLocation("");
    setDate("");
    setSelectedTagLocal("");

    onSubmit(competitionData);
    onClose();
  };

  const clearFields = () => {
    setTitle("");
    setName("");
    setLink("");
    setkind("");
    setLocation("");
    setDate("");
    setSelectedTagLocal("");
  };

  return (
    <div className="container">
      <Modal show={isOpen} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isCompetition ? "Upload a Competition" : "Add a Learning Resource"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="title">
              <Form.Label>{isCompetition ? "Title:" : "Resource title:"}</Form.Label>
              <Form.Control
                className="input-container"
                type="text"
                value={isCompetition ? title : name}
                onChange={(e) => { isCompetition ? setTitle(e.target.value) : setName(e.target.value) }}
              />
            </Form.Group>
            <Form.Group controlId="link">
              <Form.Label>{isCompetition ? "Link:" : "Resource link:"}</Form.Label>
              <Form.Control
                className="input-container"
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Form.Group>
          {isCompetition && (
            <Form.Group controlId="location">
              <Form.Label>{"Location:"}</Form.Label>
              <Form.Control
                className="input-container"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>
          )}
            <Form.Group controlId="date">
              <Form.Label>Date:</Form.Label>
              <Form.Control
                className="input-container"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
            {/* Keep competition scope separate from learning-resource categories. */}
            <Form.Group controlId="tag">
              <Form.Label>{isCompetition ? "Competition scope:" : "Resource category:"}</Form.Label>
              <Form.Control
                as="select"
                className="input-container"
                value={selectedTagLocal}
                onChange={(e) => {
                  setSelectedTagLocal(e.target.value);
                  setkind(e.target.value); // Assuming kind should be updated based on the tag value
                }}
              >
                <option value="">{isCompetition ? "Select scope" : "Select category"}</option>
                {categoryOptions.map((category) => (
                  <option value={category} key={category}>{category}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="button-container">
          <Button variant="secondary" onClick={() => { onClose(); clearFields(); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyModal;
