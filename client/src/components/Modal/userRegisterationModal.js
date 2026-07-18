import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import "./style.css";

function RegisterationModal({ isOpen, onClose, onSubmit, mode, selectedTag }) {
    const [title, setTitle] = useState("");
    const [teamName, setTeamName] = useState("");
    const [member1, setMember1] = useState("");
    const [member2, setMember2] = useState("");
    const [member3, setMember3] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [onCompetitionsTitles, setonCompetitionsTitles] = useState([]);
    const [validationError, setValidationError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchOnSiteCompeitionsTitles = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/get-onsite-competitions");
                const result = await response.json();
                console.log(result)
                setonCompetitionsTitles(result);
            } catch (error) {
                console.error("Error fetching on-site competitions:", error);
            }
        };
        fetchOnSiteCompeitionsTitles()
    }, []);

    useEffect(() => {
        if (isOpen && selectedTag) {
            setTitle(selectedTag);
        }
    }, [isOpen, selectedTag]);

    const handleSubmit = async () => {
        const RegisterationData = {
            title: title.trim(),
            teamName: teamName.trim(),
            member1: member1.trim(),
            member2: member2.trim(),
            member3: member3.trim(),
            phoneNumber: phoneNumber.trim()
        };

        const labels = {
            title: "competition",
            teamName: "team name",
            member1: "member 1 ID",
            member2: "member 2 ID",
            member3: "member 3 ID",
            phoneNumber: "phone number",
        };
        const missingFields = Object.entries(RegisterationData)
            .filter(([, value]) => !value)
            .map(([field]) => labels[field]);

        if (missingFields.length > 0) {
            setValidationError(`Please complete: ${missingFields.join(", ")}.`);
            return;
        }

        setValidationError("");
        setIsSubmitting(true);
        try {
            const submitted = await onSubmit(RegisterationData);
            if (submitted !== false) {
                clearFields();
                onClose();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearFields = () => {
        setTitle("");
        setTeamName("");
        setMember1("");
        setMember2("");
        setMember3("");
        setPhoneNumber("");
        setValidationError("");
    };

    return (
        <div className="container">
            <Modal show={isOpen} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{"Register for Competition"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="title">
                            <Form.Label>{"Select Competition: "}</Form.Label>
                            <Form.Control
                            className="input-container"
                                as="select"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            >
                                  <option value="" disabled>Select Competition</option>
                                {onCompetitionsTitles.map((competition) => (
                                    <option key={competition.id} value={competition.title}>
                                        {competition.title}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="teamName">
                            <Form.Label>{"Team Name :"}</Form.Label>
                            <Form.Control
                            className="input-container"
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="member1">
                            <Form.Label>{"Member 1 ID (xxK-xxxx): "}</Form.Label>
                            <Form.Control
                            className="input-container"
                                type="text"
                                value={member1}
                                onChange={(e) => setMember1(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="member2">
                            <Form.Label>{"Member 2 ID (xxK-xxxx): "}</Form.Label>
                            <Form.Control
                            className="input-container"
                                type="text"
                                value={member2}
                                onChange={(e) => setMember2(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="member3">
                            <Form.Label>{"Member 3 ID (xxK-xxxx): "}</Form.Label>
                            <Form.Control
                            className="input-container"
                                type="text"
                                value={member3}
                                onChange={(e) => setMember3(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="phoneNumber">
                            <Form.Label>{"Phone Number :"}</Form.Label>
                            <Form.Control
                            className="input-container"
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </Form.Group>
                        {validationError && (
                            <div className="registration-validation-error" role="alert">
                                {validationError}
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer className="button-container">
                    <Button variant="secondary" onClick={() => { onClose(); clearFields(); }} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Registering..." : "Submit"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default RegisterationModal;
