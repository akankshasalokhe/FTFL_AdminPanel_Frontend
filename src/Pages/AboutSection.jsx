import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Spinner,
  Image,
} from "react-bootstrap";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./css/AboutSection.css";

const AboutSection = () => {
  const [sections, setSections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchSections = async () => {
    try {
      const res = await axios.get("https://ftfl-backend-psi.vercel.app/api/about/getAll");
      setSections(res.data);
    } catch (err) {
      console.error("Error fetching sections", err);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setIsEditMode(false);
    setFormData({ title: "", type: "", image: "" });
    setEditId(null);
  };

  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("type", formData.type);
    if (formData.image) data.append("image", formData.image);

    try {
      if (isEditMode) {
        await axios.put(`https://ftfl-backend-psi.vercel.app/api/about/update/${editId}`, data);
      } else {
        await axios.post("https://ftfl-backend-psi.vercel.app/api/about/create", data);
      }
      fetchSections();
      handleClose();
    } catch (err) {
      console.error("Error saving section", err);
    }
    setLoading(false);
  };

  const handleEdit = (section) => {
    setFormData({
      title: section.title,
      type: section.type,
      image: section.image || "",
    });
    setEditId(section._id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      try {
        await axios.delete(`https://ftfl-backend-psi.vercel.app/api/about/delete/${id}`);
        fetchSections();
      } catch (err) {
        console.error("Error deleting section", err);
      }
    }
  };

  return (
    <Container className="about-container">
      <div className="section-header">
        <h3 className="section-title">About Section</h3>
        <div className="add-btn-wrapper">
          <Button onClick={handleShow}>+ Add Section</Button>
        </div>
      </div>

      <Row className="about-row">
        {sections.map((section) => (
          <Col
            key={section._id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            className="mb-4 d-flex justify-content-center"
          >
            <Card className="about-card shadow-sm">
              <Card.Body>
                <Card.Title className="fw-bold mb-5 ">
                  {section.title}
                </Card.Title>
                <Card.Subtitle className="mb-5 text-muted text-capitalize">
                  {section.type}
                </Card.Subtitle>

                <div className="d-flex justify-content-center gap-4 mt-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEdit(section)}
                  >
                     Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(section._id)}
                  >
                     Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit" : "Add"} Section</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formType" className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formImage" className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
              {isEditMode && formData.image && typeof formData.image === "string" && (
                <div className="mt-3 text-center">
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fluid
                    rounded
                    style={{ maxHeight: "200px" }}
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AboutSection;
