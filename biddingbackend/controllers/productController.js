const Product = require('../models/product');
const Company = require('../models/Company');
const User = require('../models/User');
 
exports.addProduct = async (req, res) => {
  try {
    const { variation, count, type, weight, noOfConesPerBag, specification, winding, monthlyBagProduction, hsnCode } = req.body;

    const userId = req.user ? req.user.id : null;
    const companyId = req.company ? req.company.id : null;

    let userOrCompany;

    if (userId) {
      userOrCompany = await User.findById(userId);
    } else if (companyId) {
      userOrCompany = await Company.findById(companyId);
    } else {
      return res.status(403).json({ error: 'Unauthorized access.' });
    }

    if (!userOrCompany) {
      return res.status(404).json({ error: `${userId ? 'User' : 'Company'} not found.` });
    }

    if (!variation || !count || !type || !weight || !noOfConesPerBag || !specification || !winding || !monthlyBagProduction || !hsnCode) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if the product already exists for the company with the same count
    const existingProduct = await Product.findOne({ count, company: companyId });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product already exists for the company with the same count.' });
    }

    const newProduct = new Product({
      variation,
      count,
      type,
      weight,
      noOfConesPerBag,
      specification,
      winding,
      monthlyBagProduction,
      hsnCode,
      ...(userId ? { user: userId } : {}),
      ...(companyId ? { company: companyId, companyDetails: userOrCompany } : {}),
    });

    const savedProduct = await newProduct.save();

    userOrCompany.products.push(savedProduct._id);
    await userOrCompany.save();

    res.status(201).json({ data: { product: savedProduct } });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.updateProduct = async (req, res) => {
  try {
    if (req.company && req.company.id && req.company.mobileNo) {
      const { mobileNo, id: companyId } = req.company;
      const { count } = req.params;

      const company = await Company.findById(companyId);
      const product = await Product.findOne({ count, company });

      if (!company || !product) {
        return res.status(404).json({ error: 'Company or Product not found.' });
      }

      if (String(product.company) !== String(companyId)) {
        return res.status(401).json({ error: 'Unauthorized access. Product does not belong to the company.' });
      }

      Object.assign(product, req.body);
      const updatedProduct = await product.save();

      res.json({ product: updatedProduct });
    } else {
      return res.status(401).json({ error: 'Unauthorized access. Company information missing or not a company.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    // Ensure that req.company exists and contains the necessary information from the token
    if (!req.company) {
      return res.status(401).json({ error: 'Unauthorized. Only companies can delete products.' });
    }

    const companyIdFromToken = req.company.id; // Assuming the token stores companyId as id
    const { count } = req.params;

    // Find the product by count and company ID
    const product = await Product.findOne({ count: count, company: companyIdFromToken });

    if (!product) {
      return res.status(404).json({ error: 'Product not found for the company.' });
    }

    // If the product is found for the company, delete it
    await product.deleteOne();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

















exports.getProducts = async (req, res) => {
  try {
    if (req.company) {
      const company = await Company.findOne({ mobileNo: req.company.mobileNo }).populate({
        path: 'products',
        options: { strictPopulate: false },
      });

      if (!company) {
        return res.status(404).json({ error: 'Company not found.' });
      }

      const products = company.products;
      res.json(products);
    } else {
      return res.status(401).json({ error: 'Unauthorized access. User information missing.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getProductById = async (req, res) => {
  try {
    if (!req.params.productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    // Ensure that the request is authenticated
    if (!req.company && !req.user) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    // Get the user or company ID based on the authentication
    const userId = req.user ? req.user.id : null;
    const companyId = req.company ? req.company.id : null;

    let userOrCompany;

    // Find the user or company based on the ID
    if (userId) {
      userOrCompany = await User.findById(userId);
    } else if (companyId) {
      userOrCompany = await Company.findById(companyId);
    } else {
      return res.status(403).json({ error: 'Unauthorized access.' });
    }

    if (!userOrCompany) {
      return res.status(404).json({ error: `${userId ? 'User' : 'Company'} not found.` });
    }

    // Find the product by ID
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getProductByCount = async (req, res) => {
  try {
    const companyId = req.company.id;
    const { count } = req.params;

    const product = await Product.findOne({ count, company: companyId });

    if (!product) {
      return res.status(404).json({ error: 'Product not found for the company.' });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error('Error fetching product by count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};