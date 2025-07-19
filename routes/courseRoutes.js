const express = require('express');
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/auth');
const { requireAdmin, requireStudent } = require('../middleware/roleAuth');
const { generalLimiter } = require('../middleware/rateLimit');
const { validateCourseInput, validateCourseUpdateInput } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 */
router.get('/', generalLimiter, courseController.getAllCourses);

/**
 * @swagger
 * /api/courses/{courseId}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course details
 */
router.get('/:courseId', generalLimiter, courseController.getCourseById);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - instructor
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               instructor:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Course created successfully
 */
router.post('/', authMiddleware, requireAdmin, generalLimiter, validateCourseInput, courseController.createCourse);

/**
 * @swagger
 * /api/courses/{courseId}:
 *   put:
 *     summary: Update course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               instructor:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Course updated successfully
 */
router.put('/:courseId', authMiddleware, requireAdmin, generalLimiter, validateCourseUpdateInput, courseController.updateCourse);

/**
 * @swagger
 * /api/courses/{courseId}:
 *   delete:
 *     summary: Delete course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course deleted successfully
 */
router.delete('/:courseId', authMiddleware, requireAdmin, generalLimiter, courseController.deleteCourse);

/**
 * @swagger
 * /api/courses/{courseId}/enroll:
 *   post:
 *     summary: Enroll in course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Successfully enrolled in course
 */
router.post('/:courseId/enroll', authMiddleware, requireStudent, generalLimiter, courseController.enrollInCourse);

/**
 * @swagger
 * /api/courses/{courseId}/enrollments:
 *   get:
 *     summary: Get course enrollments
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of course enrollments
 */
router.get('/:courseId/enrollments', authMiddleware, requireAdmin, generalLimiter, courseController.getCourseEnrollments);

module.exports = router; 