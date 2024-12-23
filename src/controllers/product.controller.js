import { Product } from '../models/product.js'

const getAllProduct = async (req, res) => {
    Product.find().then((data) => {
        res.json({
            msg: 'all product info',
            Product: data
        })
    })
}

const deleteAllProduct = async (req, res) => {
    Product.deleteMany().then(() => {
        res.json({
            msg: 'product deletd'
        })
    })
}

const getProductById = async (req, res) => {
    Product.findById(req.params.id)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json({ product });
        })
        .catch((error) => {
            res.status(500).json({ message: "Server error", error });
        });
}

const addProduct = async (req, res) => {
    try {
      const {
        productName,
        productDescription,
        productPrice,
        category,
        authorName,
        stock,
        tags,
        productImages,
      } = req.body;
  
      // Validate required fields
      if (
        !productName ||
        !productDescription ||
        productPrice === undefined ||
        !category ||
        stock === undefined
      ) {
        return res.status(400).json({
          error: 'All required fields (productName, productDescription, productPrice, category, stock) must be provided.',
        });
      }
  
      // Validate the number of images
      if (productImages && productImages.length > 4) {
        return res.status(400).json({
          error: 'You can upload a maximum of 4 images.',
        });
      }
  
      // Validate tags
      if (tags && !Array.isArray(tags)) {
        return res.status(400).json({
          error: 'Tags must be an array.',
        });
      }
  
      // Create a new product instance
      const newProduct = new Product({
        productName,
        productDescription,
        productPrice,
        category,
        authorName,
        stock,
        tags: tags || [], // Default to an empty array if tags are not provided
        productImages: productImages || [], // Default to an empty array if productImages are not provided
        createdAt: new Date(),
      });
  
      // Save the product to the database
      const savedProduct = await newProduct.save();
  
      // Send a success response
      res.status(201).json({
        message: 'Product created successfully',
        product: savedProduct,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        error: 'Failed to create product. Please try again later.',
      });
    }
  };
  
const deleteProductbyId = async (req, res) => {
    Product.deleteOne({ _id: req.params.id }).then(() => {
        res.json({ Message: "product deleted successfully!!" })
    })
}
export { getAllProduct, deleteAllProduct, getProductById, addProduct, deleteProductbyId }