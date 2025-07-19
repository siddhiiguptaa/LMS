const Enrollment = require('../models/Enrollment');

/**
 * Check if a user is enrolled in a course
 * @param {string} userId - The user ID
 * @param {number} courseId - The course ID
 * @returns {Promise<boolean>} - True if enrolled, false otherwise
 */
const isUserEnrolled = async (userId, courseId) => {
    if (!userId) return false;
    return await Enrollment.isEnrolled(userId, courseId);
};

/**
 * Filter video URLs from lessons for non-enrolled users
 * @param {Array} lessons - Array of lesson objects
 * @param {boolean} isEnrolled - Whether the user is enrolled
 * @returns {Array} - Filtered lessons without video URLs for non-enrolled users
 */
const filterLessonsForEnrollment = (lessons, isEnrolled) => {
    if (isEnrolled) {
        return lessons;
    }
    
    return lessons.map(lesson => {
        const { video_url, ...lessonWithoutVideo } = lesson;
        return lessonWithoutVideo;
    });
};

/**
 * Filter video URL from a single lesson for non-enrolled users
 * @param {Object} lesson - Lesson object
 * @param {boolean} isEnrolled - Whether the user is enrolled
 * @returns {Object} - Filtered lesson without video URL for non-enrolled users
 */
const filterLessonForEnrollment = (lesson, isEnrolled) => {
    if (isEnrolled) {
        return lesson;
    }
    
    const { video_url, ...lessonWithoutVideo } = lesson;
    return lessonWithoutVideo;
};

module.exports = {
    isUserEnrolled,
    filterLessonsForEnrollment,
    filterLessonForEnrollment
}; 