const Lesson = require('../models/Lesson');
const LessonResource = require('../models/LessonResource');
const Course = require('../models/Course');
const { isUserEnrolled, filterLessonsForEnrollment, filterLessonForEnrollment } = require('../utils/enrollmentUtils');

const getLessonsByCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { page = 1, limit = 50 } = req.query;
        const userId = req.user?.userId;

        const existingCourse = await Course.getCourseById(courseId);
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const lessons = await Lesson.findByCourse(courseId, { 
            page: parseInt(page), 
            limit: parseInt(limit) 
        });

        // Check if user is enrolled (only if user is authenticated)
        const isEnrolled = await isUserEnrolled(userId, courseId);

        // Filter video URLs for non-enrolled users
        const filteredLessons = filterLessonsForEnrollment(lessons, isEnrolled);

        res.json(filteredLessons);
    } catch (error) {
        console.error('Error getting lessons:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getLessonById = async (req, res) => {
    try {
        const lessonId = req.params.lessonId;
        const userId = req.user?.userId;
        
        const lesson = await Lesson.findById(lessonId);
        
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Check if user is enrolled in the course
        const isEnrolled = await isUserEnrolled(userId, lesson.course_id);

        // Filter video URL for non-enrolled users
        const filteredLesson = filterLessonForEnrollment(lesson, isEnrolled);

        const resources = await LessonResource.findByLesson(lessonId);
        res.json({ ...filteredLesson, resources });
    } catch (error) {
        console.error('Error getting lesson:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createLesson = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { title, videoUrl } = req.body;

        if (!title || !videoUrl) {
            return res.status(400).json({ message: 'Title and video URL are required' });
        }

        const existingCourse = await Course.getCourseById(courseId);
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const lessonId = await Lesson.create(courseId, title, videoUrl);
        const lesson = await Lesson.findById(lessonId);

        res.status(201).json({ message: 'Lesson created successfully', lesson });
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateLesson = async (req, res) => {
    try {
        const lessonId = req.params.lessonId;
        const updateData = {};

        // Only include fields that are provided in the request
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.videoUrl !== undefined) updateData.videoUrl = req.body.videoUrl;

        const existingLesson = await Lesson.findById(lessonId);
        if (!existingLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        const result = await Lesson.update(lessonId, updateData);
        if (result === 0) {
            return res.status(400).json({ message: 'No changes made' });
        }

        const updatedLesson = await Lesson.findById(lessonId);
        res.json({ message: 'Lesson updated successfully', lesson: updatedLesson });
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteLesson = async (req, res) => {
    try {
        const lessonId = req.params.lessonId;
        
        const existingLesson = await Lesson.findById(lessonId);
        if (!existingLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        const result = await Lesson.delete(lessonId);
        res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getLessonResources = async (req, res) => {
    try {
        const lessonId = req.params.lessonId;
        const userId = req.user?.userId;
        
        const existingLesson = await Lesson.findById(lessonId);
        if (!existingLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Check if user is enrolled in the course
        const isEnrolled = await isUserEnrolled(userId, existingLesson.course_id);

        // Return 403 if user is not enrolled
        if (!isEnrolled) {
            return res.status(403).json({ message: 'You must be enrolled in this course to access lesson resources' });
        }

        const resources = await LessonResource.findByLesson(lessonId);
        res.json(resources);
    } catch (error) {
        console.error('Error getting lesson resources:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addLessonResource = async (req, res) => {
    try {
        const lessonId = req.params.lessonId;
        const { resourceUrl } = req.body;

        if (!resourceUrl) {
            return res.status(400).json({ message: 'Resource URL is required' });
        }

        const existingLesson = await Lesson.findById(lessonId);
        if (!existingLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        const resourceId = await LessonResource.add(lessonId, resourceUrl);
        const resource = await LessonResource.findByLesson(lessonId);

        res.status(201).json({ message: 'Resource added successfully', resource });
    } catch (error) {
        console.error('Error adding lesson resource:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteLessonResource = async (req, res) => {
    try {
        const resourceId = req.params.resId;
        
        const result = await LessonResource.delete(resourceId);
        if (result === 0) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        console.error('Error deleting lesson resource:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getLessonsByCourse,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
    getLessonResources,
    addLessonResource,
    deleteLessonResource
}; 