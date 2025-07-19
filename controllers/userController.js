const User = require('../models/User');
const { withTransaction } = require('../utils/transaction');

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password_hash, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateCurrentUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const updateData = {};

        // Only include fields that are provided in the request
        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.email !== undefined) updateData.email = req.body.email;

        if (updateData.email) {
            const existingUser = await User.findByEmail(updateData.email);
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        const result = await withTransaction(async (connection) => {
            const updateResult = await User.updateUser(userId, updateData, connection);
            if (updateResult === 0) {
                throw new Error('No changes made');
            }
            const updatedUser = await User.findById(userId);
            return updatedUser;
        });

        const { password_hash, ...userWithoutPassword } = result;
        
        res.json({ message: 'Profile updated successfully', user: userWithoutPassword });
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.message === 'No changes made') {
            return res.status(400).json({ message: 'No changes made' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const users = await User.getAllUsers({ page: parseInt(page), limit: parseInt(limit) });
        res.json(users);
    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password_hash, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updateData = {};

        // Only include fields that are provided in the request
        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.email !== undefined) updateData.email = req.body.email;
        if (req.body.role !== undefined) updateData.role = req.body.role;

        if (updateData.email) {
            const existingUser = await User.findByEmail(updateData.email);
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        await withTransaction(async (connection) => {
            const result = await User.updateUser(userId, updateData, connection);
            if (result === 0) {
                throw new Error('No changes made');
            }
        });

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.message === 'No changes made') {
            return res.status(400).json({ message: 'No changes made' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        await withTransaction(async (connection) => {
            const result = await User.deleteUser(req.params.userId);
            if (result === 0) {
                throw new Error('User not found');
            }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        if (error.message === 'User not found') {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getCurrentUser,
    updateCurrentUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}; 