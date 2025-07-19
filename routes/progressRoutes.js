const express = require('express');
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/auth');
const { requireStudent } = require('../middleware/roleAuth');
const { generalLimiter } = require('../middleware/rateLimit');

const router = express.Router();

/**
 * @swagger
 * /api/lessons/{lessonId}/complete:
 *   post:
 *     summary: Mark lesson as complete
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lesson marked as complete
 */
router.post('/lessons/:lessonId/complete', authMiddleware, requireStudent, generalLimiter, progressController.markLessonComplete);

/**
 * @swagger
 * /api/me/lessons/completions:
 *   get:
 *     summary: Get user's lesson completions
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of completed lessons
 */
router.get('/me/lessons/completions', authMiddleware, requireStudent, generalLimiter, progressController.getLessonCompletions);

/**
 * @swagger
 * /api/quizzes/{quizId}/attempts:
 *   post:
 *     summary: Submit quiz attempt
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
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
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                     selectedOptionId:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Quiz attempt submitted successfully
 */
router.post('/quizzes/:quizId/attempts', authMiddleware, requireStudent, generalLimiter, progressController.submitQuizAttempt);

/**
 * @swagger
 * /api/quizzes/{quizId}/attempts:
 *   get:
 *     summary: Get quiz attempts for a quiz
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of quiz attempts
 */
router.get('/quizzes/:quizId/attempts', authMiddleware, requireStudent, generalLimiter, progressController.getQuizAttempts);

/**
 * @swagger
 * /api/me/attempts:
 *   get:
 *     summary: Get all user attempts
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all user attempts
 */
router.get('/me/attempts', authMiddleware, requireStudent, generalLimiter, progressController.getAllAttempts);

/**
 * @swagger
 * /api/attempts/{attemptId}:
 *   get:
 *     summary: Get attempt details
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attempt details
 */
router.get('/attempts/:attemptId', authMiddleware, requireStudent, generalLimiter, progressController.getAttemptDetails);

/**
 * @swagger
 * /api/courses/{courseId}/progress:
 *   get:
 *     summary: Get course progress
 *     tags: [Progress]
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
 *         description: Course progress details
 */
router.get('/courses/:courseId/progress', authMiddleware, requireStudent, generalLimiter, progressController.getCourseProgress);

/**
 * @swagger
 * /api/me/progress:
 *   get:
 *     summary: Get user progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User progress details
 */
router.get('/me/progress', authMiddleware, requireStudent, generalLimiter, progressController.getUserProgress);

module.exports = router; 