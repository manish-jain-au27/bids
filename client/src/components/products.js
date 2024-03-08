import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DashboardLinks from './DashboardLink';
import CreateOffer from './CreateOffer';
import baseURL from '../baseUrl';
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProductCount, setSelectedProductCount] = useState(null);
  const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const companyToken = localStorage.getItem('companyToken');
        const response = await fetch(`${baseURL}/product/get-all`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${companyToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          throw new Error('Error fetching products: ' + response.statusText);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const extractCountFromFormat = (count) => {
    const match = count.match(/\b(.+)\b/);
    return match ? match[1] : null;
  };

  const handleCreateOfferClick = (count) => {
    setSelectedProductCount(count);
    setShowCreateOfferModal(true);
  };

  const handleCloseCreateOfferModal = () => {
    setShowCreateOfferModal(false);
  };

  const handleExitButtonClick = () => {
    setShowCreateOfferModal(false);
  };

  const deleteProduct = async (count) => {
    try {
      const companyToken = localStorage.getItem('companyToken');
      const response = await fetch(`${baseURL}/product/delete/${count}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${companyToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setProducts(products.filter(product => product.count !== count));
      } else {
        throw new Error('Error deleting product: ' + response.statusText);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ marginTop: '100px' }}>
      <DashboardLinks />
      <h2>Products</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Count</th>
                <th>Action</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.count}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleCreateOfferClick(product.count)}
                    >
                      Create Offer
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => deleteProduct(product.count)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showCreateOfferModal} onHide={handleCloseCreateOfferModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateOffer selectedProductCount={selectedProductCount} onClose={handleCloseCreateOfferModal} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleExitButtonClick}>
            Exit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;
