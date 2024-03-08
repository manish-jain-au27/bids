import React, { useState } from 'react';
import { Form, Button, Row, Col, Spinner, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DashboardLinks from './DashboardLink';
import baseURL from '../baseUrl';

const specificationOptions = [
  'KWEFT', 'KW', 'KCWEFT', 'KCW', 'CWEFT', 'CW',
  'CCWEFT', 'CCW', 'KHTWEFT', 'KHTW', 'CHTWEFT', 'CHTW'
];

const initialBlend = { blend: '', percentage: '' };

const initialFormData = {
  variation: '',
  countNo: '',
  type: '',
  weight: '',
  noOfConesPerBag: '',
  specification: '',
  winding: '',
  monthlyBagProduction: '',
  hsnCode: '',
  blends: [initialBlend], // Initialize with one empty blend
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showCountModal, setShowCountModal] = useState(false);
  const [selectedCount, setSelectedCount] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddBlend = () => {
    setFormData({
      ...formData,
      blends: [...formData.blends, initialBlend], // Add a new empty blend
    });
  };

  const handleBlendChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBlends = [...formData.blends];
    updatedBlends[index] = { ...updatedBlends[index], [name]: value };
    setFormData({
      ...formData,
      blends: updatedBlends,
    });
  };

  const handleCountModalClose = () => {
    setShowCountModal(false);
  };

  const handleCountModalSelect = (countValue) => {
    setFormData({
      ...formData,
      countNo: countValue,
    });
    setSelectedCount(countValue); // Set the selected count
    setShowCountModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
  
      const companyToken = localStorage.getItem('companyToken');
  
      if (!companyToken) {
        setError('Authentication token is missing.');
        return;
      }
  
      const response = await fetch(`${baseURL}/product/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${companyToken}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const data = await response.json();
        console.error('Error adding product:', data.error);
        setError(data.error || 'Error adding product. Please try again.');
        setSuccess(false);
        return;
      }
  
      const data = await response.json();
      console.log('Product added successfully:', data);
      setFormData(initialFormData);
      setSuccess(true);
      setSelectedCount('');
    } catch (error) {
      console.error('Error adding product:', error.message);
      setError('Error adding product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const getCountOptions = () => {
    if (formData.type === 'single') {
      return Array.from({ length: 100 }, (_, index) => `${index + 1}s`);
    } else if (formData.type === 'double') {
      return Array.from({ length: 100 }, (_, index) => `${index + 1}/2`);
    } else {
      return [];
    }
  };

  const steps = [
    { key: 'variation', label: 'Select Variation', next: 'type' },
    { key: 'type', label: 'Select Type', next: 'countNo' },
    { key: 'countNo', label: 'Select Count', next: 'specification' },
    { key: 'specification', label: 'Select Specification', next: 'winding' },
    { key: 'winding', label: 'Select Winding', next: 'weight' },
    { key: 'weight', label: 'Enter Weight', next: 'noOfConesPerBag' },
    { key: 'noOfConesPerBag', label: 'Enter No. of Cones Per Bag', next: 'monthlyBagProduction' },
    { key: 'monthlyBagProduction', label: 'Enter Monthly Bag Production', next: 'hsnCode' },
    { key: 'hsnCode', label: 'Enter HSN Code', next: null },
  ];

  const currentStepIndex = steps.findIndex(step => formData[step.key] === '');
  const currentStep = steps[currentStepIndex];
  const nextStepLabel = currentStep ? steps[currentStepIndex + 1]?.label : null;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add Product</h2>
      <DashboardLinks />
      {!success && (
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6} className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <i className="bi bi-person-fill mr-2"></i> Variation{' '}
                {formData.variation && (
                  <span className="text-info">{`(Step: Select Variation)`}</span>
                )}
              </Form.Label>
              <Form.Control
                as="select"
                name="variation"
                value={formData.variation}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Variation</option>
                <option value="cotton">Cotton</option>
                <option value="polyester">Polyester</option>
              </Form.Control>
            </Col>
      
            <Col md={6} className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <i className="bi bi-tag-fill mr-2"></i> Type{' '}
                {formData.variation && !formData.type && (
                  <span className="text-info">{`(Step: Select Type)`}</span>
                )}
              </Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                disabled={!formData.variation}
              >
                <option value="" disabled>Select Type</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
              </Form.Control>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <i className="bi bi-tag-fill mr-2"></i> Count{' '}
                {formData.type && !formData.countNo && (
                  <span className="text-info">{`(Step: Select Count)`}</span>
                )}
              </Form.Label>
              <Button variant="outline-secondary" onClick={() => setShowCountModal(true)}>
                {selectedCount ? selectedCount : "Select Count"}
              </Button>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6} className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <i className="bi bi-layers mr-2"></i> Specification{' '}
                {formData.countNo && !formData.specification && (
                  <span className="text-info">{`(Step: Select Specification)`}</span>
                )}
              </Form.Label>
              <Form.Control
                as="select"
                name="specification"
                value={formData.specification}
                onChange={handleInputChange}
                required
                disabled={!formData.countNo}
              >
                <option value="" disabled>Select Specification</option>
                {specificationOptions.map((spec, index) => (
                  <option key={index} value={spec}>
                    {spec}
                  </option>
                ))}
              </Form.Control>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <i className="bi bi-arrow-repeat mr-2"></i> Winding{' '}
                {formData.specification && !formData.winding && (
                  <span className="text-info">{`(Step: Select Winding)`}</span>
                )}
              </Form.Label>
              <Form.Control
                as="select"
                name="winding"
                value={formData.winding}
                onChange={handleInputChange}
                required
                disabled={!formData.specification}
              >
                <option value="" disabled>Select Winding</option>
                <option value="auto">Auto</option>
                <option value="non-auto">Non-Auto</option>
              </Form.Control>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6} className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <i className="bi bi-file-weight mr-2"></i> Weight{' '}
                {formData.winding && !formData.weight && (
                  <span className="text-info">{`(Step: Enter Weight)`}</span>
                )}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                required
                disabled={!formData.winding}
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <i className="bi bi-box mr-2"></i> No. of Cones Per Bag{' '}
                {formData.weight && !formData.noOfConesPerBag && (
                  <span className="text-info">{`(Step: Enter No. of Cones Per Bag)`}</span>
                )}
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of cones per bag"
                name="noOfConesPerBag"
                value={formData.noOfConesPerBag}
                onChange={handleInputChange}
                required
                disabled={!formData.weight}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6} className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <i className="bi bi-box-seam mr-2"></i> Monthly Bag Production{' '}
                {formData.noOfConesPerBag && !formData.monthlyBagProduction && (
                  <span className="text-info">{`(Step: Enter Monthly Bag Production)`}</span>
                )}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter monthly bag production"
                name="monthlyBagProduction"
                value={formData.monthlyBagProduction}
                onChange={handleInputChange}
                required
                disabled={!formData.noOfConesPerBag}
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <i className="bi bi-card-text mr-2"></i> HSN Code{' '}
                {formData.monthlyBagProduction && !formData.hsnCode && (
                  <span className="text-info">{`(Step: Enter HSN Code)`}</span>
                )}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter HSN code"
                name="hsnCode"
                value={formData.hsnCode}
                onChange={handleInputChange}
                required
                disabled={!formData.monthlyBagProduction}
              />
            </Col>
          </Row>
          {formData.blends.map((blend, index) => (
      <Row key={index} className="mb-3">
        <Col md={6} className="mb-3">
          <Form.Label className="d-flex align-items-center">
            <i className="bi bi-plus-circle mr-2"></i> Blend {index + 1} - Blend Type
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter blend type"
            name="blend"
            value={blend.blend}
            onChange={(e) => handleBlendChange(index, e)}
            required
          />
        </Col>
        <Col md={6} className="mb-3">
          <Form.Label className="d-flex align-items-center">
            <i className="bi bi-percent mr-2"></i> Percentage
          </Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter percentage"
            name="percentage"
            value={blend.percentage}
            onChange={(e) => handleBlendChange(index, e)}
            required
          />
        </Col>
      </Row>
    ))}
    <Button variant="outline-secondary" onClick={handleAddBlend}>
      Add Blend
    </Button>

          {currentStep && (
            <div className="mb-3">
              <p className="text-info">{currentStep.label}</p>
              {nextStepLabel && (
                <p className="text-muted">Next: {nextStepLabel}</p>
              )}
            </div>
          )}

          {error && <p className="text-danger">{error}</p>}
          {loading && <Spinner animation="border" role="status" />}

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Adding Product...' : 'Submit'}
          </Button>

          <Modal show={showCountModal} onHide={handleCountModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Select Count</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {getCountOptions().map((count, index) => (
                <Button
                  key={index}
                  variant="outline-secondary"
                  onClick={() => handleCountModalSelect(count)}
                  className="mr-2 mb-2"
                >
                  {count}
                </Button>
              ))}
            </Modal.Body>
          </Modal>
        </Form>
      )}

      {success && (
        <div className="alert alert-success mt-3">
          Product added successfully!
        </div>
      )}

      {success && (
        <Button
          variant="primary"
          onClick={() => setSuccess(false)}
          className="mt-3"
        >
          Add Another Product
        </Button>
      )}
    </div>
  );
};

export default AddProduct;
