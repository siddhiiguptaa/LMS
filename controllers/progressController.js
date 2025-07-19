const LessonCompletion = require('../models/LessonCompletion');
const QuizAttempt = require('../models/QuizAttempt');
const QuizAttemptAnswer = require('../models/QuizAttemptAnswer');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Option = require('../models/Option');
const { isUserEnrolled } = require('../utils/enrollmentUtils');
const { withTransaction } = require('../utils/transaction');

const markLessonComplete = async (req, res) => {
    try {
        const lessonId = req.params.lessonId;
        const userId = req.user.userId;

        // Get lesson to check course enrollment
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Check if user is enrolled in the course
        const isEnrolled = await isUserEnrolled(userId, lesson.course_id);
        if (!isEnrolled) {
            return res.status(403).json({ message: 'You must be enrolled in this course to mark lessons as complete' });
        }

        await withTransaction(async (connection) => {
            await LessonCompletion.markComplete(userId, lessonId, connection);
        });
        
        res.json({ message: 'Lesson marked as completed' });
    } catch (error) {
        console.error('Error marking lesson complete:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getLessonCompletions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const completions = await LessonCompletion.findByUser(userId);
        res.json(completions);
    } catch (error) {
        console.error('Error getting lesson completions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const submitQuizAttempt = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const userId = req.user.userId;
        const { answers } = req.body;

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Answers array is required' });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const questions = await Question.findByQuiz(quizId);
        const questionIds = questions.map(q => q.id);
        const answerQuestionIds = answers.map(a => a.questionId);
        
        // Check if all questions are answered
        if (questionIds.length !== answerQuestionIds.length) {
            return res.status(400).json({ message: 'Number of answers must match number of questions' });
        }
        
        // Check if all question IDs in answers exist in the quiz
        const invalidQuestions = answerQuestionIds.filter(id => !questionIds.includes(id));
        if (invalidQuestions.length > 0) {
            return res.status(400).json({ message: 'Invalid question IDs provided' });
        }

        const existingAttempts = await QuizAttempt.findByQuizAndUser(quizId, userId);
        const attemptNumber = existingAttempts.length + 1;

        // Execute all database operations within a transaction
        const result = await withTransaction(async (connection) => {
            const attemptId = await QuizAttempt.start(userId, quizId, attemptNumber, 0, connection);

            let correctAnswers = 0;
            const totalQuestions = questions.length;

            for (const answer of answers) {
                const { questionId, selectedOptionId } = answer;
                
                const options = await Option.findByQuestion(questionId);
                const selectedOption = options.find(opt => opt.id === selectedOptionId);
                
                if (selectedOption && selectedOption.is_correct) {
                    correctAnswers++;
                }

                await QuizAttemptAnswer.record(
                    attemptId, 
                    questionId, 
                    selectedOptionId, 
                    selectedOption ? selectedOption.is_correct : false,
                    connection
                );
            }

            const score = Math.round((correctAnswers / totalQuestions) * 100);
            await QuizAttempt.updateScore(attemptId, score, connection);

            return { attemptId, score, correctAnswers, totalQuestions };
        });

        const { score, correctAnswers, totalQuestions } = result;

        res.status(201).json({ 
            message: 'Quiz attempt submitted successfully',
            score,
            correctAnswers,
            totalQuestions
        });
    } catch (error) {
        console.error('Error submitting quiz attempt:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getQuizAttempts = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const userId = req.user.userId;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const attempts = await QuizAttempt.findByQuizAndUser(quizId, userId);
        res.json(attempts);
    } catch (error) {
        console.error('Error getting quiz attempts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllAttempts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const attempts = await QuizAttempt.findByUser(userId);
        res.json(attempts);
    } catch (error) {
        console.error('Error getting all attempts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAttemptDetails = async (req, res) => {
    try {
        const attemptId = req.params.attemptId;
        const userId = req.user.userId;

        const attempt = await QuizAttempt.findById(attemptId);
        if (!attempt) {
            return res.status(404).json({ message: 'Attempt not found' });
        }

        if (attempt.user_id !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const answers = await QuizAttemptAnswer.findByAttempt(attemptId);
        res.json({ ...attempt, answers });
    } catch (error) {
        console.error('Error getting attempt details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCourseProgress = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.user.userId;

        const course = await Course.getCourseById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const isEnrolled = await isUserEnrolled(userId, courseId);
        if (!isEnrolled) {
            return res.status(403).json({ message: 'Not enrolled in this course' });
        }

        const lessons = await Lesson.findByCourse(courseId);
        const lessonCompletions = await LessonCompletion.findByUser(userId);
        const completedLessons = lessonCompletions.filter(lc => 
            lessons.some(lesson => lesson.id === lc.lesson_id)
        );

        const quizzes = await Quiz.findByCourse(courseId);
        const quizAttempts = await QuizAttempt.findByQuizAndUser(quizzes[0]?.id, userId);

        const lessonProgress = lessons.length > 0 ? 
            Math.round((completedLessons.length / lessons.length) * 100) : 0;

        const latestQuizScore = quizAttempts.length > 0 ? quizAttempts[0].score : null;

        res.json({
            courseId,
            totalLessons: lessons.length,
            completedLessons: completedLessons.length,
            lessonProgress: `${lessonProgress}%`,
            totalQuizzes: quizzes.length,
            latestQuizScore,
            lastActivity: quizAttempts.length > 0 ? quizAttempts[0].attempted_at : null
        });
    } catch (error) {
        console.error('Error getting course progress:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserProgress = async (req, res) => {
    try {
        const userId = req.user.userId;

        const enrollments = await Enrollment.findByUser(userId);
        const progress = [];

        for (const enrollment of enrollments) {
            const courseId = enrollment.course_id;
            const lessons = await Lesson.findByCourse(courseId);
            const lessonCompletions = await LessonCompletion.findByUser(userId);
            const completedLessons = lessonCompletions.filter(lc => 
                lessons.some(lesson => lesson.id === lc.lesson_id)
            );

            const quizzes = await Quiz.findByCourse(courseId);
            const quizAttempts = await QuizAttempt.findByQuizAndUser(quizzes[0]?.id, userId);

            const lessonProgress = lessons.length > 0 ? 
                Math.round((completedLessons.length / lessons.length) * 100) : 0;

            progress.push({
                courseId,
                courseTitle: enrollment.title,
                totalLessons: lessons.length,
                completedLessons: completedLessons.length,
                lessonProgress: `${lessonProgress}%`,
                totalQuizzes: quizzes.length,
                latestQuizScore: quizAttempts.length > 0 ? quizAttempts[0].score : null,
                enrolledAt: enrollment.enrolled_at
            });
        }

        res.json(progress);
    } catch (error) {
        console.error('Error getting user progress:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    markLessonComplete,
    getLessonCompletions,
    submitQuizAttempt,
    getQuizAttempts,
    getAllAttempts,
    getAttemptDetails,
    getCourseProgress,
    getUserProgress
}; 