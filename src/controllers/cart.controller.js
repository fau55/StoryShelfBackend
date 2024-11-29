import { Cart } from '../models/cart.js'

const getAllCart = async (req, res) => {
    Cart.find().then((data) => {
        res.json({
            msg: 'all cart info',
            Cart: data
        })
    })
}

const removeCartItem = async (req, res) => {
    const userId = req.params.id;
    const itemId = req.params.itemId;

    if (!itemId) {
        return res.status(400).json({ message: 'Item ID is required.' });
    }

    Cart.findOneAndUpdate(
        { userId: userId },
        { $pull: { items: { _id: itemId } } }, // Use $pull to remove the item from the items array
        { new: true } // Return the updated document
    )
        .then((updatedCart) => {
            if (!updatedCart) {
                return res.status(404).json({ message: 'Cart not found for this user.' });
            }
            res.status(200).json({
                message: 'Item removed successfully.',
                cart: updatedCart,
            });
        })
        .catch((error) => {
            console.error('Error removing item:', error);
            res.status(500).json({ message: 'Internal server error.', error });
        });
}

const createCart = async (req, res) => {


    let newCart = new Cart({
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productQuantity: req.body.productQuantity,
    })
    newCart.save().then(() => {
        res.json({
            msg: 'cart created'
        })
    })
}

const updateCart = async (req, res) => {
    Cart.updateOne({
        _id: req.params.id
    }, {
        productQuantity: req.body.productQuantity

    }).then(() => {
        res.json({
            msg: 'cart updated'
        })
    })

}

const deleteAll = async (req, res) => {
    Cart.deleteMany().then(() => {
        res.json({
            msg: 'cart deletd'
        })
    })
}

const addItem = async (req, res) => {
    try {
        const userId = req.params.id;
        const { productId, quantity, priceAtPurchase } = req.body;

        // Validate request body
        if (!productId || !quantity || !priceAtPurchase) {
            return res.status(400).json({ error: 'Missing product details in request body.' });
        }

        // Find the cart by user ID
        let cart = await Cart.findOne({ userId: userId });

        // If cart doesn't exist, create a new one
        if (!cart) {
            cart = new Cart({
                userId,
                items: [],
                totalPrice: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // Check if the product already exists in the cart
        const existingProductIndex = cart.items.findIndex((item) => item.productId === productId);

        if (existingProductIndex !== -1) {
            // Update quantity and price if the product already exists
            cart.items[existingProductIndex].quantity += quantity;
            cart.items[existingProductIndex].priceAtPurchase = priceAtPurchase;
        } else {
            // Add new product to the cart
            cart.items.push({ productId, quantity, priceAtPurchase });
        }

        // Update the total price
        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + item.quantity * item.priceAtPurchase;
        }, 0);

        // Update the updatedAt field
        cart.updatedAt = new Date();

        // Save the cart to the database
        await cart.save();

        // Send the updated cart as a response
        res.status(200).json({ message: 'Product added to cart successfully', cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'An error occurred while adding the product to the cart.' });
    }
}

const getCartById = async (req, res) => {
    Cart.find({
        userId: req.params.id
    }).then((data) => {
        res.json({
            cart: data
        })
    })
}

export { getAllCart, removeCartItem, createCart, updateCart, deleteAll, addItem, getCartById }