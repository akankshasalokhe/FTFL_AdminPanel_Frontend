import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    description: "",
    rating: "",
  });
  const [editId, setEditId] = useState(null);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get("http://localhost:5005/api/testimonial/get");
      setTestimonials(res.data);
    } catch (err) {
      alert("Failed to fetch testimonials");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpen = (testimonial = null) => {
    if (testimonial) {
      setFormData({
        title: testimonial.title,
        name: testimonial.name,
        description: testimonial.description,
        rating: testimonial.rating,
      });
      setEditId(testimonial._id);
    } else {
      setFormData({ title: "", name: "", description: "", rating: "" });
      setEditId(null);
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({ title: "", name: "", description: "", rating: "" });
    setEditId(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:5005/api/testimonial/update/${editId}`, formData);
      } else {
        await axios.post("http://localhost:5005/api/testimonial/create", formData);
      }
      fetchTestimonials();
      handleClose();
    } catch (err) {
      alert("Failed to save testimonial");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await axios.delete(`http://localhost:5005/api/testimonial/delete/${id}`);
      fetchTestimonials();
    } catch (err) {
      alert("Failed to delete testimonial");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="align-items-center mb-3">
        <Col><h2 className="text-center">Testimonials</h2></Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => handleOpen()}>
            + Add Testimonial
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Name</th>
            <th>Description</th>
            <th>Rating</th>
            <th style={{ minWidth: "120px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((t, index) => (
            <tr key={t._id}>
              <td>{index + 1}</td>
              <td>{t.title}</td>
              <td>{t.name}</td>
              <td>{t.description}</td>
              <td>{t.rating}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleOpen(t)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(t._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit" : "Add"} Testimonial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Rating (0 to 5)</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Testimonial;
