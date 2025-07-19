const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { withTransaction } = require('../utils/transaction');

const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await User.findByEmail(email);

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await withTransaction(async (connection) => {
            const userId = await User.createUser(name, email, hashedPassword, role, connection);
            return userId;
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: result,
                name,
                email,
                role
            }
        });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

const login = async (req, res) => {
    console.log('Request received for login', req.body);
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials',
                error: 'User not found'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid credentials',
                error: 'Invalid password'
            });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

module.exports = {
    register,
    login
}