// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./Models/user");
const Cart = require("./Models/cart");
const Product = require("./Models/product");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://farahhashmi13sk:sag1yluM8pUlafjC@cluster0.vlsff.mongodb.net/StoryShelf?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Connection failed:", err);
  });

// API endpoints
app.get("/api/ss/user/get/all", (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json({
        message: "All users fetched successfully",
        allUser: users,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error fetching users",
        error: err,
      });
    });
});

app.get('/api/ss/user/get/by/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// API to register user
app.post("/api/ss/user/register", async (req, res) => {
  try {
    // Create a new user instance from the request body
    const userToAdd = new User({ ...req.body });

    // Save the user to the database
    const user = await userToAdd.save();

    // Check if the user was created successfully
    if (!user) {
      return res.status(500).json({ message: "User registration failed" });
    }

    // Create a new cart for the user
    const newCart = new Cart({
      userId: user._id,
      totalPrice: 0
    });
    await newCart.save();

    // Respond with success
    return res.status(201).json({
      message: "Registered successfully!",
      user,
    });
  } catch (err) {
    // Handle errors and send a response
    console.error(err);
    return res.status(400).json({
      error: err.message || "An error occurred during registration",
    });
  }
});


// API for login
app.post("/api/ss/user/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        if (user.password === req.body.password) {
          res.status(200).json({
            message: "Login successful",
            userExist: true,
            correctPassword: true,
            userRole: user.role,
            user_id: user._id,
            user_name: `${user.firstName} ${user.lastName}`,
          });
        } else {
          res.status(200).json({
            message: "Wrong password",
            userExist: true,
            correctPassword: false,
          });
        }
      } else {
        res.status(200).json({
          message: "User does not exist",
          userExist: false,
          correctPassword: false,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

app.post('/api/ss/user/update/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile photo
    user.profilePhoto = req.body.profilePhoto;

    // Save the updated user document
    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


//API to get all cart info (retrieve)
app.get('/api/cart/getall', (req, res, next) => {
  Cart.find().then((data) => {
    res.json({
      msg: 'all cart info',
      Cart: data
    })
  })
})

app.get('/api/cart/remove/item/by/:id/:itemId', (req, res) => {
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
});
//API to create cart(create)
app.post('/api/cart/create', (req, res, next) => {


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
})

//API to update cart (update)
app.put('/api/cart/update/:id', (req, res, next) => {
  Cart.updateOne({
    _id: req.params.id
  }, {
    productQuantity: req.body.productQuantity

  }).then(() => {
    res.json({
      msg: 'cart updated'
    })
  })

})

//API to delete all cart
app.delete('/api/cart/deleteall', (req, res, next) => {
  Cart.deleteMany().then(() => {
    res.json({
      msg: 'cart deletd'
    })
  })
})


// Add a product to the cart by user ID
app.post('/api/cart/add/product/:id', async (req, res) => {
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
});
//API find cart by user_id
app.get('/api/cart/get/by/:id', (req, res, next) => {
  Cart.find({
    userId: req.params.id
  }).then((data) => {
    res.json({
      cart: data
    })
  })
})

//API to retrieve all product
app.get('/api/product/getall', (req, res, next) => {
  Product.find().then((data) => {
    res.json({
      msg: 'all product info',
      Product: data
    })
  })
})
//API to delete all product
app.delete('/api/product/deleteall', (req, res, next) => {
  Product.deleteMany().then(() => {
    res.json({
      msg: 'product deletd'
    })
  })
})

// get product by product id
app.get('/api/product/get/by/:id', (req, res, next) => {
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
});


//API to create product
app.post('/api/product/create', (req, res) => {
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
});
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
