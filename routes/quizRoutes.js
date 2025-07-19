const express = require('express');
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleAuth');
const { generalLimiter } = require('../middleware/rateLimit');
const { validateQuizInput, validateQuizUpdateInput, validateQuestionInput, validateQuestionUpdateInput, validateOptionInput, validateOptionUpdateInput } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/courses/{courseId}/quizzes:
 *   get:
 *     summary: Get quizzes by course
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of quizzes
 */
router.get('/courses/:courseId/quizzes', generalLimiter, quizController.getQuizzesByCourse);

/**
 * @swagger
 * /api/quizzes/{quizId}:
 *   get:
 *     summary: Get quiz by ID
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quiz details
 */
router.get('/quizzes/:quizId', generalLimiter, quizController.getQuizById);

/**
 * @swagger
 * /api/courses/{courseId}/quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quizzes]
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
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Quiz created successfully
 */
router.post('/courses/:courseId/quizzes', authMiddleware, requireAdmin, generalLimiter, validateQuizInput, quizController.createQuiz);

/**
 * @swagger
 * /api/quizzes/{quizId}:
 *   put:
 *     summary: Update quiz
 *     tags: [Quizzes]
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
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 */
router.put('/quizzes/:quizId', authMiddleware, requireAdmin, generalLimiter, validateQuizUpdateInput, quizController.updateQuiz);

/**
 * @swagger
 * /api/quizzes/{quizId}:
 *   delete:
 *     summary: Delete quiz
 *     tags: [Quizzes]
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
 *         description: Quiz deleted successfully
 */
router.delete('/quizzes/:quizId', authMiddleware, requireAdmin, generalLimiter, quizController.deleteQuiz);

/**
 * @swagger
 * /api/quizzes/{quizId}/questions:
 *   get:
 *     summary: Get questions by quiz
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of questions
 */
router.get('/quizzes/:quizId/questions', generalLimiter, quizController.getQuestionsByQuiz);

/**
 * @swagger
 * /api/questions/{questionId}:
 *   get:
 *     summary: Get question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question details
 */
router.get('/questions/:questionId', generalLimiter, quizController.getQuestionById);

/**
 * @swagger
 * /api/quizzes/{quizId}/questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
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
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Question created successfully
 */
router.post('/quizzes/:quizId/questions', authMiddleware, requireAdmin, generalLimiter, validateQuestionInput, quizController.createQuestion);

/**
 * @swagger
 * /api/questions/{questionId}:
 *   put:
 *     summary: Update question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
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
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Question updated successfully
 */
router.put('/questions/:questionId', authMiddleware, requireAdmin, generalLimiter, validateQuestionUpdateInput, quizController.updateQuestion);

/**
 * @swagger
 * /api/questions/{questionId}:
 *   delete:
 *     summary: Delete question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question deleted successfully
 */
router.delete('/questions/:questionId', authMiddleware, requireAdmin, generalLimiter, quizController.deleteQuestion);

/**
 * @swagger
 * /api/questions/{questionId}/options:
 *   post:
 *     summary: Add option to question
 *     tags: [Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
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
 *               - text
 *               - isCorrect
 *             properties:
 *               text:
 *                 type: string
 *               isCorrect:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Option added successfully
 */
router.post('/questions/:questionId/options', authMiddleware, requireAdmin, generalLimiter, validateOptionInput, quizController.addOption);

/**
 * @swagger
 * /api/options/{optionId}:
 *   put:
 *     summary: Update option
 *     tags: [Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: optionId
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
 *               text:
 *                 type: string
 *               isCorrect:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Option updated successfully
 */
router.put('/options/:optionId', authMiddleware, requireAdmin, generalLimiter, validateOptionUpdateInput, quizController.updateOption);

/**
 * @swagger
 * /api/options/{optionId}:
 *   delete:
 *     summary: Delete option
 *     tags: [Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Option deleted successfully
 */
router.delete('/options/:optionId', authMiddleware, requireAdmin, generalLimiter, quizController.deleteOption);

module.exports = router; 