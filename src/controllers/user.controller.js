import { User } from '../models/user.js'
import { Cart } from '../models/cart.js'


const getAllUsers = async (req, res) => {

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
}

const getUserById = async (req, res) => {
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
}

const register = async (req, res) => {
    try {
        const { firstName, lastName, phone, email, password, gender } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }


        // Create and save the user
        const user = new User({
            firstName,
            lastName,
            phone,
            email,
            password,
            gender,
            role: 'buyer'
        });

        const savedUser = await user.save();

        // Create a new cart for the user
        const newCart = new Cart({
            userId: savedUser._id,
            totalPrice: 0,
        });
        await newCart.save();

        // Respond with success
        return res.status(201).json({
            message: 'Registered successfully!',
            user: {
                id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                role: savedUser.role,
            },
        });
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({
            error: err.message || 'An error occurred during registration',
        });
    }
};

const login = async (req, res) => {
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
}


const uploadUserProfile = async (req, res) => {
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
}

const deleteAll = async (req,res) =>{
    User.deleteMany().then(()=>{
        res.status(400).json({Message : 'Deleted All the user Successfully!!'})
    })
}
export { getAllUsers, getUserById, register, login, uploadUserProfile, deleteAll }