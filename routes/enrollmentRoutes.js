const express = require('express');
const Enrollment = require('../models/Enrollment');
const authMiddleware = require('../middleware/auth');
const { requireStudent } = require('../middleware/roleAuth');
const { generalLimiter } = require('../middleware/rateLimit');

const router = express.Router();

const getUserEnrollments = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page = 1, limit = 20 } = req.query;
        
        const enrollments = await Enrollment.findByUser(userId, { 
            page: parseInt(page), 
            limit: parseInt(limit) 
        });
        res.json(enrollments);
    } catch (error) {
        console.error('Error getting user enrollments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/users/me/enrollments:
 *   get:
 *     summary: Get user enrollments
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of user enrollments
 */
router.get('/me/enrollments', authMiddleware, requireStudent, generalLimiter, getUserEnrollments);

module.exports = router; 