import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Alert, Form, Row, Col, Table } from 'react-bootstrap';

const platforms = ['facebook', 'instagram', 'linkedin', 'twitter', 'whatsapp'];

const FooterAdmin = () => {
  const [footer, setFooter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    socialLinks: [],
    contactInfo: { phone: '', hours: '', address: '' },
  });

  const fetchFooter = async () => {
    try {
      const { data } = await axios.get('https://ftfl-backend-psi.vercel.app/api/footer/get');
      setFooter(data);
      if (data) setFormData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [name]: value },
    }));
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updated = [...formData.socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, socialLinks: updated }));
  };

  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '' }],
    }));
  };

  const removeSocialLink = (index) => {
    const updated = formData.socialLinks.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, socialLinks: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (footer?._id) {
        await axios.put(`https://ftfl-backend-psi.vercel.app/api/footer/update/${footer._id}`, formData);
        setAlert({ type: 'success', message: 'Footer updated successfully' });
      } else {
        await axios.post('https://ftfl-backend-psi.vercel.app/api/footer/create', formData);
        setAlert({ type: 'success', message: 'Footer created successfully' });
      }
      fetchFooter();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setAlert({ type: 'danger', message: 'Something went wrong' });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://ftfl-backend-psi.vercel.app/api/footer/delete/${footer._id}`);
      setFooter(null);
      setFormData({
        socialLinks: [],
        contactInfo: { phone: '', hours: '', address: '' },
      });
      setAlert({ type: 'success', message: 'Footer deleted successfully' });
    } catch (err) {
      console.error(err);
      setAlert({ type: 'danger', message: 'Delete failed' });
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Footer Settings</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          {footer ? 'Edit Footer' : 'Create Footer'}
        </Button>
      </div>

      {alert.message && (
        <Alert
          variant={alert.type}
          onClose={() => setAlert({ type: '', message: '' })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}

      {footer && (
        <>
          <h5 className="mb-3">Contact Information</h5>
          <ul className="list-group mb-4">
            <li className="list-group-item">
              <strong>Phone:</strong> {footer.contactInfo.phone}
            </li>
            <li className="list-group-item">
              <strong>Working Hours:</strong> {footer.contactInfo.hours}
            </li>
            <li className="list-group-item">
              <strong>Address:</strong> {footer.contactInfo.address}
            </li>
          </ul>

          <h5 className="mb-3">Social Links</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Platform</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {footer.socialLinks.map((link, idx) => (
                <tr key={idx}>
                  <td>{link.platform}</td>
                  <td>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.url}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Button variant="danger" onClick={handleDelete}>
            Delete Footer
          </Button>
        </>
      )}

      {/* Modal */}
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{footer ? 'Update Footer' : 'Create Footer'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>Contact Info</h6>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.contactInfo.phone}
                  onChange={handleContactChange}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Label>Working Hours</Form.Label>
                <Form.Control
                  type="text"
                  name="hours"
                  value={formData.contactInfo.hours}
                  onChange={handleContactChange}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.contactInfo.address}
                  onChange={handleContactChange}
                  required
                />
              </Col>
            </Row>

            <hr />
            <h6>Social Links</h6>
            {formData.socialLinks.map((link, index) => (
              <Row className="mb-2" key={index}>
                <Col md={4}>
                  <Form.Select
                    value={link.platform}
                    onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                    required
                  >
                    <option value="">Select Platform</option>
                    {platforms.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="url"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                    required
                  />
                </Col>
                <Col md={2}>
                  <Button
                    variant="outline-danger"
                    onClick={() => removeSocialLink(index)}
                    className="w-100"
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="secondary" onClick={addSocialLink}>
              + Add Social Link
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {footer ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default FooterAdmin;