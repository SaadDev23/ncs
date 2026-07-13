import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import "./style.css";

function MyModal2({ isOpen, onClose, onSubmit, mode, selectedTag }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [max_registerations, setMaxRegisterations] = useState("");
  const [selectedTagLocal, setSelectedTagLocal] = useState(selectedTag || ""); // Set the initial value based on the selectedTag prop

  const handleSubmit = () => {
    const onSiteCompetionData = {
      title,
      location,
      date,
      max_registerations,
      tag: selectedTagLocal, // Include selected tag in the data
    };
    setTitle("");
    setLocation("");
    setDate("");
    setMaxRegisterations("");
    setSelectedTagLocal("");

    onSubmit(onSiteCompetionData);
    onClose();
  };

  const clearFields = () => {
    setTitle("");
    setLocation("");
    setMaxRegisterations("");
    setDate("");
    setSelectedTagLocal("");
  };

  return (
    <div className="container">
      <Modal show={isOpen} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{"Upload On-Site Competition"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="title">
              <Form.Label>{"Title:"}</Form.Label>
              <Form.Control
                className="input-container"
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value) }}
              />
            </Form.Group>
              <Form.Group controlId="location">
                <Form.Label>{"Location:"}</Form.Label>
                <Form.Control
                  className="input-container"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Form.Group>
            <Form.Group controlId="max_registerations">
              <Form.Label>Max_Registerations:</Form.Label>
              <Form.Control
                className="input-container"
                type="number"
                value={max_registerations}
                onChange={(e) => setMaxRegisterations(e.target.value)}
              />
            </Form.Group>
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

export default MyModal2;
