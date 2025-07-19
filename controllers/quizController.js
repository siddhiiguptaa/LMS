const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Option = require('../models/Option');
const Course = require('../models/Course');
const { withTransaction } = require('../utils/transaction');

const getQuizzesByCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        
        const existingCourse = await Course.getCourseById(courseId);
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const quizzes = await Quiz.findByCourse(courseId);
        res.json(quizzes);
    } catch (error) {
        console.error('Error getting quizzes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getQuizById = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const quiz = await Quiz.findById(quizId);
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const questions = await Question.findByQuiz(quizId);
        const questionsWithOptions = await Promise.all(
            questions.map(async (question) => {
                const options = await Option.findByQuestion(question.id);
                return { ...question, options };
            })
        );

        res.json({ ...quiz, questions: questionsWithOptions });
    } catch (error) {
        console.error('Error getting quiz:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createQuiz = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Quiz title is required' });
        }

        const existingCourse = await Course.getCourseById(courseId);
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const result = await withTransaction(async (connection) => {
            const quizId = await Quiz.create(courseId, title, connection);
            const quiz = await Quiz.findById(quizId);
            return quiz;
        });

        res.status(201).json({ message: 'Quiz created successfully', quiz: result });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateQuiz = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const updateData = {};

        // Only include fields that are provided in the request
        if (req.body.title !== undefined) updateData.title = req.body.title;

        const existingQuiz = await Quiz.findById(quizId);
        if (!existingQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const result = await Quiz.update(quizId, updateData.title);
        if (result === 0) {
            return res.status(400).json({ message: 'No changes made' });
        }

        const updatedQuiz = await Quiz.findById(quizId);
        res.json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteQuiz = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        
        const existingQuiz = await Quiz.findById(quizId);
        if (!existingQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        await withTransaction(async (connection) => {
            await Quiz.delete(quizId, connection);
        });
        
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getQuestionsByQuiz = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        
        const existingQuiz = await Quiz.findById(quizId);
        if (!existingQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const questions = await Question.findByQuiz(quizId);
        const questionsWithOptions = await Promise.all(
            questions.map(async (question) => {
                const options = await Option.findByQuestion(question.id);
                return { ...question, options };
            })
        );

        res.json(questionsWithOptions);
    } catch (error) {
        console.error('Error getting questions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getQuestionById = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const question = await Question.findById(questionId);
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const options = await Option.findByQuestion(questionId);
        res.json({ ...question, options });
    } catch (error) {
        console.error('Error getting question:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createQuestion = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'Question text is required' });
        }

        const existingQuiz = await Quiz.findById(quizId);
        if (!existingQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const result = await withTransaction(async (connection) => {
            const questionId = await Question.create(quizId, text, connection);
            const question = await Question.findById(questionId);
            return question;
        });

        res.status(201).json({ message: 'Question created successfully', question: result });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateQuestion = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const updateData = {};

        // Only include fields that are provided in the request
        if (req.body.text !== undefined) updateData.text = req.body.text;

        const existingQuestion = await Question.findById(questionId);
        if (!existingQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const result = await Question.update(questionId, updateData.text);
        if (result === 0) {
            return res.status(400).json({ message: 'No changes made' });
        }

        const updatedQuestion = await Question.findById(questionId);
        res.json({ message: 'Question updated successfully', question: updatedQuestion });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        
        const existingQuestion = await Question.findById(questionId);
        if (!existingQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        await withTransaction(async (connection) => {
            await Question.delete(questionId, connection);
        });
        
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addOption = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const { text, isCorrect } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'Option text is required' });
        }

        const existingQuestion = await Question.findById(questionId);
        if (!existingQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const result = await withTransaction(async (connection) => {
            const optionId = await Option.create(questionId, text, isCorrect || false, connection);
            const option = await Option.findByQuestion(questionId);
            return option;
        });

        res.status(201).json({ message: 'Option added successfully', option: result });
    } catch (error) {
        console.error('Error adding option:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateOption = async (req, res) => {
    try {
        const optionId = req.params.optionId;
        const updateData = {};

        // Only include fields that are provided in the request
        if (req.body.text !== undefined) updateData.text = req.body.text;
        if (req.body.isCorrect !== undefined) updateData.isCorrect = req.body.isCorrect;

        const result = await Option.update(optionId, updateData);
        if (result === 0) {
            return res.status(404).json({ message: 'Option not found' });
        }

        res.json({ message: 'Option updated successfully' });
    } catch (error) {
        console.error('Error updating option:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteOption = async (req, res) => {
    try {
        const optionId = req.params.optionId;
        
        await withTransaction(async (connection) => {
            const result = await Option.delete(optionId, connection);
            if (result === 0) {
                throw new Error('Option not found');
            }
        });
        
        res.json({ message: 'Option deleted successfully' });
    } catch (error) {
        console.error('Error deleting option:', error);
        if (error.message === 'Option not found') {
            return res.status(404).json({ message: 'Option not found' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getQuizzesByCourse,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getQuestionsByQuiz,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    addOption,
    updateOption,
    deleteOption
}; 