// ProductPage.js
import React, { useState, useEffect } from 'react';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const userToken = localStorage.getItem('userToken');
        const response = await fetch('http://localhost:3001/api/user/all-products', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          if (Array.isArray(data.allProducts)) {
            setProducts(data.allProducts);
          } else {
            setError('Invalid products structure in API response.');
          }
        } else {
          setError('Error fetching products: ' + response.statusText);
        }
      } catch (error) {
        setError('Error fetching products: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToWishlist = async (productId, companyId) => {
    try {
      const userToken = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:3001/api/user/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          count: productId, // Assuming productId is the count for simplicity
          companyId,
        }),
      });

      if (response.ok) {
        console.log('Added to Wishlist:', productId, companyId);
        // Implement any additional logic as needed
      } else {
        console.error('Error adding to wishlist:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error.message);
    }
  };

  return (
    <div>
      <h2>Product Page</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <div>
          <ul>
            {products.map((product) => (
              <li key={product.productId}>
                {product.count} - {product.companyName}
                <button onClick={() => handleAddToWishlist(product.productId, product.companyId)}>
                  Add to Wishlist
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
