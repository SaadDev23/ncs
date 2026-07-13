import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import "./style.css";

function MyModal({ isOpen, onClose, onSubmit, mode, selectedTag }) {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [kind, setkind] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [selectedTagLocal, setSelectedTagLocal] = useState(selectedTag || ""); // Set the initial value based on the selectedTag prop

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
          <Modal.Title>{mode === "competition" ? "Upload A Competition" : "Upload A Past Paper"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="title">
              <Form.Label>{mode === "competition" ? "Title:" : "Name:"}</Form.Label>
              <Form.Control
                className="input-container"
                type="text"
                value={mode === "competition" ? title : name}
                onChange={(e) => { mode === "competition" ? setTitle(e.target.value) : setName(e.target.value) }}
              />
            </Form.Group>
            <Form.Group controlId="link">
              <Form.Label>Link:</Form.Label>
              <Form.Control
                className="input-container"
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Form.Group>
          {mode === "competition" && (
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
            {/* Dropdown for selecting tag */}
            <Form.Group controlId="tag">
              <Form.Label>Tag:</Form.Label>
              <Form.Control
                as="select"
                className="input-container"
                value={selectedTagLocal}
                onChange={(e) => {
                  setSelectedTagLocal(e.target.value);
                  setkind(e.target.value); // Assuming kind should be updated based on the tag value
                }}
              >
                <option value="">Select Tag</option>
                <option value="Local">Local</option>
                <option value="Regional">Regional</option>
                <option value="Worldwide">Worldwide</option>
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
