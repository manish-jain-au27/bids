import React, { useState, useEffect } from 'react';
import { FaHeart, FaSpinner } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserNavbar from './UserNavbar';
import baseURL from '../baseUrl';
const ProductDetails = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [userToken, setUserToken] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken) {
      setUserToken(storedToken);
      fetchAllProducts(storedToken);
    } else {
      setError('User not authenticated');
      setLoading(false);
    }
  }, []);

  const fetchAllProducts = async (token) => {
    try {
      const response = await fetch(`${baseURL}/user/all-products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const productsArray = data.allProducts || [];

        if (productsArray.length > 0) {
          setProducts(productsArray);
          setSelectedProduct(productsArray[0]?.count || '');
          setSelectedCompanies(getCompaniesForProduct(productsArray[0]?.count, productsArray));
        } else {
          setError('No products found.');
        }
      } else {
        console.error('Error fetching product details:', response.statusText);
        setError('Error fetching product details: ' + response.statusText);
      }
    } catch (error) {
      console.error('Error fetching product details:', error.message);
      setError('Error fetching product details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCompaniesForProduct = (selectedProductCount, productsArray) => {
    const companies = productsArray
      .filter(product => product.count === selectedProductCount)
      .map(product => ({
        companyName: product.companyName,
        companyId: product.companyId,
        companyShortName: product.companyShortName, // Include company short name
      }));
    return companies;
  };

  const handleAddToWishlist = async (companyData) => {
    try {
      const decodedToken = parseJwt(userToken);
      const { mobileNo, userId } = decodedToken;
  
      const { companyId, companyName, companyShortName } = companyData;
  
      const response = await fetch(`${baseURL}/user/wishlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          userId,
          mobileNo,
          count: selectedProduct,
          companyId,
          companyShortName, // Include company short name in the request
        }),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        console.log('Added to Wishlist:', { selectedProduct, companyName, companyId, companyShortName });
        
        setSuccessMessage('Product added to wishlist successfully!');
        clearSuccessMessageAfterDelay();
        // You might want to update the UI or show a success message
      } else if (response.status === 400) {
        console.error('Error adding to wishlist:', responseData);
        const errorMessage = responseData.message || 'Unknown error occurred';
        setError('Error adding to wishlist: ' + errorMessage);
      } else {
        console.error('Error adding to wishlist:', response.statusText);
        setError('Error adding to wishlist: ' + response.statusText);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error.message);
      setError('Error adding to wishlist: ' + error.message);
    }
  };
  
  const clearSuccessMessageAfterDelay = () => {
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000); // Adjust the delay (in milliseconds) as needed
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="container mt-5">
      <UserNavbar />
      <h2 className="text-center mb-4">Product Details</h2>
      {loading && <p className="text-center"><FaSpinner className="fa-spin" /> Loading...</p>}
      {error && <p className="text-center text-danger">Error: {error}</p>}
      {successMessage && <p className="text-center text-success">{successMessage}</p>}
      {!loading && !error && (
        <div>
          <h3 className="mb-3">All Products:</h3>
          <div className="d-flex align-items-center mb-3">
            <label className="me-2">Select Product:</label>
            <select
              value={selectedProduct}
              onChange={(e) => {
                const selectedProductCount = e.target.value;
                setSelectedProduct(selectedProductCount);
                setSelectedCompanies(getCompaniesForProduct(selectedProductCount, products));
              }}
              className="form-select"
            >
              {Array.from(new Set(products.map(product => product.count))).map((count, index) => (
                <option key={index} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div>
              <p>Selected Product Count: {selectedProduct}</p>
              <p>Associated Companies:</p>
              <ul>
                {selectedCompanies.map((companyData, index) => (
                  <li key={index} className="mb-2">
                    {companyData.companyName}
                    <button
                      onClick={() => handleAddToWishlist(companyData)}
                      className="btn btn-outline-success btn-sm ms-2"
                    >
                      <FaHeart className="me-1" /> Add to Wishlist
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
