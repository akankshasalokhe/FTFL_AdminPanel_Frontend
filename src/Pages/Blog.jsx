import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Alert,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./css/BlogPage.css";

const BlogPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [blogData, setBlogData] = useState({
    _id: "",
    title: "",
    description: "",
    image: null,
    headingImage: null,
    headings: [],
    items: [],
  });

  const fetchBlogs = async () => {
    try {
      const res = await fetch("https://ftfl-backend-psi.vercel.app/api/blog/get");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      showAlert("Failed to fetch blogs", "danger");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
  };

  const handleShow = () => {
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setIsEditMode(false);
    setBlogData({
      _id: "",
      title: "",
      description: "",
      image: null,
      headingImage: null,
      headings: [],
      items: [],
    });
  };

  const handleInputChange = (e) => {
    setBlogData({ ...blogData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, key) => {
    const file = e.target.files[0];
    setBlogData({ ...blogData, [key]: file });
  };

  const addHeading = () => {
    setBlogData({ ...blogData, headings: [...blogData.headings, ""] });
  };

  const updateHeading = (index, value) => {
    const updated = [...blogData.headings];
    updated[index] = value;
    setBlogData({ ...blogData, headings: updated });
  };

  const deleteHeading = (index) => {
    const updated = [...blogData.headings];
    updated.splice(index, 1);
    setBlogData({ ...blogData, headings: updated });
  };

  const addItem = () => {
    setBlogData({
      ...blogData,
      items: [...blogData.items, { title: "", description: "" }],
    });
  };

  const updateItem = (index, field, value) => {
    const updated = [...blogData.items];
    updated[index][field] = value;
    setBlogData({ ...blogData, items: updated });
  };

  const deleteItem = (index) => {
    const updated = [...blogData.items];
    updated.splice(index, 1);
    setBlogData({ ...blogData, items: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("description", blogData.description);
    if (blogData.image) formData.append("image", blogData.image);
    if (blogData.headingImage) formData.append("headingImage", blogData.headingImage);
    formData.append("headings", JSON.stringify(blogData.headings));
    formData.append("items", JSON.stringify(blogData.items));

    try {
      const url = isEditMode
        ? `https://ftfl-backend-psi.vercel.app/api/blog/update/${blogData._id}`
        : `https://ftfl-backend-psi.vercel.app/api/blog/create`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const result = await res.json();
      showAlert(`Blog ${isEditMode ? "updated" : "created"} successfully!`);
      fetchBlogs();
    } catch (err) {
      console.error("Error:", err);
      showAlert("Failed to save blog", "danger");
    }

    handleClose();
  };

  const handleEdit = (blog) => {
    setIsEditMode(true);
    setShowModal(true);
    setBlogData({
      _id: blog._id,
      title: blog.title,
      description: blog.description,
      headings: blog.headings || [],
      items: blog.items || [],
      image: null,
      headingImage: null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await fetch(`https://ftfl-backend-psi.vercel.app/api/blog/delete/${id}`, {
        method: "DELETE",
      });
      showAlert("Blog deleted successfully!", "warning");
      fetchBlogs();
    } catch (err) {
      showAlert("Delete failed", "danger");
    }
  };

  return (
    <Container className="my-5">
      <div className=" mb-4">
        <div>
          <h2 className="text-center fs-3 fw-bold">Blog</h2>
        </div>
        <div className="text-end">
          <Button onClick={handleShow} variant="primary">
            Create Blog
          </Button>
        </div>
      </div>

     

      {alert.show && (
        <Alert variant={alert.variant} className="text-center">
          {alert.message}
        </Alert>
      )}

      <Row>
        {blogs.map((blog, idx) => (
          <Col md={6} lg={4} key={blog._id || idx} className="mb-4">
            <Card className="custom-card h-100">
              <Card.Img
                variant="top"
                src={blog.image || "https://via.placeholder.com/300x180"}
                className="custom-card-img"
              />
              <Card.Body className="d-flex flex-column text-center justify-content-between">
                <Card.Title>{blog.title}</Card.Title>
                <div className="d-flex justify-content-between">
                  <Button variant="outline-primary" size="sm" onClick={() => handleEdit(blog)}>
                    {/* <FaEdit /> */}Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(blog._id)}>
                    {/* <FaTrash /> */}Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit Blog" : "Create Blog"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={blogData.title} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Main Image</Form.Label>
              {isEditMode && blogData.image === null && (
                <div className="preview-img mb-2">
                  <img
                    src={blogs.find((b) => b._id === blogData._id)?.image}
                    alt="Main"
                  />
                </div>
              )}
              <Form.Control type="file" onChange={(e) => handleImageChange(e, "image")} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" rows={3} value={blogData.description} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Heading Image</Form.Label>
              {isEditMode && blogData.headingImage === null && (
                <div className="preview-img mb-2">
                  <img
                    src={blogs.find((b) => b._id === blogData._id)?.headingImage}
                    alt="Heading"
                  />
                </div>
              )}
              <Form.Control type="file" onChange={(e) => handleImageChange(e, "headingImage")} />
            </Form.Group>

            <div className="mb-3 border-top pt-3">
              <h5>
                Headings <Button variant="outline-success" size="sm" onClick={addHeading}>Add</Button>
              </h5>
              {blogData.headings.map((heading, idx) => (
                <div key={idx} className="d-flex gap-2 mb-2">
                  <Form.Control value={heading} onChange={(e) => updateHeading(idx, e.target.value)} />
                  <Button variant="outline-danger" onClick={() => deleteHeading(idx)}>Delete</Button>
                </div>
              ))}
            </div>

            <div className="mb-3 border-top pt-3">
              <h5>
                Items <Button variant="outline-success" size="sm" onClick={addItem}>Add Item</Button>
              </h5>
              {blogData.items.map((item, idx) => (
                <div key={idx} className="mb-3 p-2 border rounded">
                  <Form.Group className="mb-2">
                    <Form.Label>Item Title</Form.Label>
                    <Form.Control value={item.title} onChange={(e) => updateItem(idx, "title", e.target.value)} />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Item Description</Form.Label>
                    <Form.Control as="textarea" rows={2} value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} />
                  </Form.Group>
                  <Button variant="outline-danger" className="mt-2" onClick={() => deleteItem(idx)}>Delete</Button>
                </div>
              ))}
            </div>

            <div className="text-end">
              <Button type="submit" variant="success">
                {isEditMode ? "Update" : "Save"} Blog
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default BlogPage;
