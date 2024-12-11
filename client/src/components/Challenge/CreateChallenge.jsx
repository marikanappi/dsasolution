import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Card,
  Dropdown,
} from "react-bootstrap";

const NewChallenge = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [tempSelectedMaterials, setTempSelectedMaterials] = useState([]);

  const materials = [
    { id: 1, type: "image", name: "Image Material" },
    { id: 2, type: "document", name: "Document Material" },
    { id: 3, type: "audio", name: "Audio Material" },
  ];

  const toggleModal = () => setShowModal(!showModal);

  const handleTempMaterialSelect = (material) => {
    if (tempSelectedMaterials.some((item) => item.id === material.id)) {
      setTempSelectedMaterials(
        tempSelectedMaterials.filter((item) => item.id !== material.id)
      );
    } else {
      setTempSelectedMaterials([...tempSelectedMaterials, material]);
    }
  };

  const applyMaterialSelection = () => {
    const newMaterials = tempSelectedMaterials.filter(
      (tempMaterial) =>
        !selectedMaterials.some((item) => item.id === tempMaterial.id)
    );
    setSelectedMaterials([...selectedMaterials, ...newMaterials]);
    setTempSelectedMaterials([]);
    toggleModal();
  };

  const handleMaterialRemove = (id) => {
    setSelectedMaterials(selectedMaterials.filter((item) => item.id !== id));
  };

  const isMaterialSelected = (material) =>
    tempSelectedMaterials.some((item) => item.id === material.id);

  return (
    <Container className="m-0" style={{ fontSize: "12px", maxWidth: "360px" }}>
      <h6>New Challenge</h6>
      <hr />
      <Col>
        <Row className="mb-1">
          <Col xs={4}>
            <Form.Label>Topic</Form.Label>
          </Col>
          <Col xs={8}>
            <Form.Select size="sm">
              <option>Suggested for You</option>
              <option>Topic 1</option>
              <option>Topic 2</option>
              <option>Topic 4</option>
              <option>Topic 5</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-1">
          <Col xs={4}>
            <Form.Label>Select Material</Form.Label>
          </Col>
          <Col xs={8}>
            <Button variant="primary" size="sm" onClick={toggleModal}>
              Open
            </Button>
          </Col>
        </Row>

        <div className="m-0">
          <Col>
            {selectedMaterials.length === 0 ? (
              <p style={{ fontSize: "10px" }}>No materials selected yet.</p>
            ) : (
              <div
                style={{
                  maxWidth: "300px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                  fontSize: "10px",
                }}
              >
                {selectedMaterials.map((material) => (
                  <div
                    key={material.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "2px 4px",
                      backgroundColor: "#f9f9f9",
                      fontSize: "10px",
                      width: "auto",
                    }}
                  >
                    <span>{material.name}</span>
                    <Button
                      variant="danger"
                      size="sm"
                      style={{
                        padding: "0 4px",
                        fontSize: "8px",
                        marginLeft: "5px",
                      }}
                      onClick={() => handleMaterialRemove(material.id)}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Col>
        </div>

        <Row className="mb-1">
          <Col xs={5}>
            <Form.Label>Number of Questions</Form.Label>
          </Col>
          <Col xs={7}>
            <Form.Select size="sm">
              {[...Array(10).keys()].map((num) => (
                <option key={num + 1}>{num + 1}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Row>
          <Col className="text-end">
            <Button variant="secondary" size="sm" className="me-1">
              Cancel
            </Button>
            <Button variant="success" size="sm">
              Generate
            </Button>
          </Col>
        </Row>
      </Col>

      <Modal show={showModal} onHide={toggleModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>
            Group Materials
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap gap-1">
            {materials.map((material) => (
              <Card
                key={material.id}
                style={{
                  width: "90px",
                  cursor: "pointer",
                  fontSize: "10px",
                  border: isMaterialSelected(material)
                    ? "2px solid #007bff"
                    : "1px solid #ddd",
                  backgroundColor: isMaterialSelected(material)
                    ? "#e9f5ff"
                    : "#fff",
                }}
                onClick={() => handleTempMaterialSelect(material)}
              >
                <Card.Body className="text-center p-2">
                  <Card.Title>{material.type}</Card.Title>
                  <Card.Text>{material.name}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" size="sm" onClick={applyMaterialSelection}>
            Select
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NewChallenge;
