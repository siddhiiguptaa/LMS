const express = require('express');
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleAuth');
const { generalLimiter } = require('../middleware/rateLimit');
const { validateLessonInput, validateLessonUpdateInput } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/courses/{courseId}/lessons:
 *   get:
 *     summary: Get lessons by course
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of lessons
 */
router.get('/courses/:courseId/lessons', generalLimiter, lessonController.getLessonsByCourse);

/**
 * @swagger
 * /api/courses/{courseId}/lessons/{lessonId}:
 *   get:
 *     summary: Get lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lesson details
 */
router.get('/courses/:courseId/lessons/:lessonId', generalLimiter, lessonController.getLessonById);

/**
 * @swagger
 * /api/courses/{courseId}/lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
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
 *             required:
 *               - title
 *               - videoUrl
 *             properties:
 *               title:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lesson created successfully
 */
router.post('/courses/:courseId/lessons', authMiddleware, requireAdmin, generalLimiter, validateLessonInput, lessonController.createLesson);

/**
 * @swagger
 * /api/courses/{courseId}/lessons/{lessonId}:
 *   put:
 *     summary: Update lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: lessonId
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
 *               videoUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 */
router.put('/courses/:courseId/lessons/:lessonId', authMiddleware, requireAdmin, generalLimiter, validateLessonUpdateInput, lessonController.updateLesson);

/**
 * @swagger
 * /api/courses/{courseId}/lessons/{lessonId}:
 *   delete:
 *     summary: Delete lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 */
router.delete('/courses/:courseId/lessons/:lessonId', authMiddleware, requireAdmin, generalLimiter, lessonController.deleteLesson);

/**
 * @swagger
 * /api/lessons/{lessonId}/resources:
 *   get:
 *     summary: Get lesson resources
 *     tags: [Lesson Resources]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of lesson resources
 */
router.get('/lessons/:lessonId/resources', generalLimiter, lessonController.getLessonResources);

/**
 * @swagger
 * /api/lessons/{lessonId}/resources:
 *   post:
 *     summary: Add lesson resource
 *     tags: [Lesson Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resourceUrl
 *             properties:
 *               resourceUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Resource added successfully
 */
router.post('/lessons/:lessonId/resources', authMiddleware, requireAdmin, generalLimiter, lessonController.addLessonResource);

/**
 * @swagger
 * /api/lessons/{lessonId}/resources/{resId}:
 *   delete:
 *     summary: Delete lesson resource
 *     tags: [Lesson Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: resId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 */
router.delete('/lessons/:lessonId/resources/:resId', authMiddleware, requireAdmin, generalLimiter, lessonController.deleteLessonResource);

module.exports = router; 