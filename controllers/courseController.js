const authMiddleware = require('../middleware/auth');
const roleAuthMiddleware = require('../middleware/roleAuth');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const { isUserEnrolled, filterLessonsForEnrollment } = require('../utils/enrollmentUtils');
const { withTransaction } = require('../utils/transaction');

const getAllCourses = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '' } = req.query;
        const courses = await Course.getAllCoursesWithPagination({ 
            page: parseInt(page), 
            limit: parseInt(limit), 
            search 
        });
        res.json(courses);
    } catch (error) {
        console.error('Error getting courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.user?.userId;
        
        const course = await Course.getCourseById(courseId);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const lessons = await Lesson.findByCourse(courseId);
        const quizzes = await Quiz.findByCourse(courseId);

        // Check if user is enrolled (only if user is authenticated)
        const isEnrolled = await isUserEnrolled(userId, courseId);

        // Filter video URLs for non-enrolled users
        const filteredLessons = filterLessonsForEnrollment(lessons, isEnrolled);

        res.json({
            ...course,
            lessons: filteredLessons,
            quizzes
        });
    } catch (error) {
        console.error('Error getting course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createCourse = async (req, res) => {
    try {
        const { title, description, instructor, price } = req.body;

        if (!title || !description || !instructor) {
            return res.status(400).json({ message: 'Title, description, and instructor are required' });
        }

        const result = await withTransaction(async (connection) => {
            const courseId = await Course.createCourse(title, description, instructor, price || 0, connection);
            const course = await Course.getCourseById(courseId);
            return course;
        });

        res.status(201).json({ message: 'Course created successfully', course: result });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const updateData = {};

        // Only include fields that are provided in the request
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        if (req.body.instructor !== undefined) updateData.instructor = req.body.instructor;
        if (req.body.price !== undefined) updateData.price = req.body.price;

        const existingCourse = await Course.getCourseById(courseId);
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const result = await Course.updateCourse(courseId, updateData);
        if (result === 0) {
            return res.status(400).json({ message: 'No changes made' });
        }

        const updatedCourse = await Course.getCourseById(courseId);
        res.json({ message: 'Course updated successfully', course: updatedCourse });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        
        const existingCourse = await Course.getCourseById(courseId);
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await withTransaction(async (connection) => {
            await Course.deleteCourse(courseId, connection);
        });
        
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const enrollInCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.user.userId;

        const existingCourse = await Course.getCourseById(courseId);
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const isEnrolled = await Enrollment.isEnrolled(userId, courseId);
        if (isEnrolled) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        await withTransaction(async (connection) => {
            await Enrollment.enroll(userId, courseId, connection);
        });
        
        res.status(201).json({ message: 'Successfully enrolled in course' });
    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCourseEnrollments = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { page = 1, limit = 20 } = req.query;

        const existingCourse = await Course.getCourseById(courseId);
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const enrollments = await Enrollment.findByCourse(courseId, { 
            page: parseInt(page), 
            limit: parseInt(limit) 
        });
        res.json(enrollments);
    } catch (error) {
        console.error('Error getting course enrollments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    getCourseEnrollments
};