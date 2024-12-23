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
    const { productName, productDescription, productPrice, category, stock, tags, productImages } = req.body;

    // Validate the number of images
    if (productImages && productImages.length > 4) {
        return res.status(400).json({
            error: 'You can upload a maximum of 4 images.',
        });
    }


    // Create a new product instance
    const newProduct = new Product({
        productName,
        productDescription,
        productPrice,
        category,
        stock,
        tags,
        productImages,
        createdAt: new Date(),
    });


    // Save the product
    newProduct
        .save()
        .then((product) => {
            res.status(201).json({
                message: 'Product created successfully',
                product,
            });
        })
        .catch((error) => {
            console.error('Error creating product:', error);
            res.status(500).json({
                error: 'Failed to create product',
            });
        });
}
const deleteProductbyId = async (req, res) => {
    Product.deleteOne({ _id: req.params.id }).then(() => {
        res.json({ Message: "product deleted successfully!!" })
    })
}
export { getAllProduct, deleteAllProduct, getProductById, addProduct, deleteProductbyId }