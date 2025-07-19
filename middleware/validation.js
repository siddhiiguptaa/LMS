const validateUserInput = (req, res, next) => {
    const { name, email, password } = req.body;
    
    if (!name || name.trim().length < 2) {
        return res.status(400).json({ message: 'Name must be at least 2 characters long' });
    }
    
    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Valid email is required' });
    }
    
    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    next();
};

const validateCourseInput = (req, res, next) => {
    const { title, description, instructor, price } = req.body;
    
    if (!title || title.trim().length < 3) {
        return res.status(400).json({ message: 'Title must be at least 3 characters long' });
    }
    
    if (!description || description.trim().length < 10) {
        return res.status(400).json({ message: 'Description must be at least 10 characters long' });
    }
    
    if (!instructor || instructor.trim().length < 2) {
        return res.status(400).json({ message: 'Instructor name must be at least 2 characters long' });
    }
    
    if (price !== undefined && (isNaN(price) || price < 0)) {
        return res.status(400).json({ message: 'Price must be a non-negative number' });
    }
    
    next();
};

const validateLessonInput = (req, res, next) => {
    const { title, videoUrl } = req.body;
    
    if (!title || title.trim().length < 3) {
        return res.status(400).json({ message: 'Title must be at least 3 characters long' });
    }
    
    if (!videoUrl || !videoUrl.includes('http')) {
        return res.status(400).json({ message: 'Valid video URL is required' });
    }
    
    next();
};

const validateQuizInput = (req, res, next) => {
    const { title } = req.body;
    
    if (!title || title.trim().length < 3) {
        return res.status(400).json({ message: 'Quiz title must be at least 3 characters long' });
    }
    
    next();
};

const validateQuestionInput = (req, res, next) => {
    const { text } = req.body;
    
    if (!text || text.trim().length < 5) {
        return res.status(400).json({ message: 'Question text must be at least 5 characters long' });
    }
    
    next();
};

const validateOptionInput = (req, res, next) => {
    const { text } = req.body;
    
    if (!text || text.trim().length < 1) {
        return res.status(400).json({ message: 'Option text is required' });
    }
    
    next();
};

const validateCourseUpdateInput = (req, res, next) => {
    const { title, description, instructor, price } = req.body;

    if (title !== undefined && (!title || title.trim().length < 3)) {
        return res.status(400).json({ message: 'Title must be at least 3 characters long' });
    }
    
    if (description !== undefined && (!description || description.trim().length < 10)) {
        return res.status(400).json({ message: 'Description must be at least 10 characters long' });
    }
    
    if (instructor !== undefined && (!instructor || instructor.trim().length < 2)) {
        return res.status(400).json({ message: 'Instructor name must be at least 2 characters long' });
    }
    
    if (price !== undefined && (isNaN(price) || price < 0)) {
        return res.status(400).json({ message: 'Price must be a non-negative number' });
    }
    
    next();
};

const validateLessonUpdateInput = (req, res, next) => {
    const { title, videoUrl } = req.body;
    
    if (title !== undefined && (!title || title.trim().length < 3)) {
        return res.status(400).json({ message: 'Title must be at least 3 characters long' });
    }
    
    if (videoUrl !== undefined && (!videoUrl || !videoUrl.includes('http'))) {
        return res.status(400).json({ message: 'Valid video URL is required' });
    }
    
    next();
};

const validateQuizUpdateInput = (req, res, next) => {
    const { title } = req.body;
    
    if (title !== undefined && (!title || title.trim().length < 3)) {
        return res.status(400).json({ message: 'Quiz title must be at least 3 characters long' });
    }
    
    next();
};

const validateQuestionUpdateInput = (req, res, next) => {
    const { text } = req.body;
    
    if (text !== undefined && (!text || text.trim().length < 5)) {
        return res.status(400).json({ message: 'Question text must be at least 5 characters long' });
    }
    
    next();
};

const validateOptionUpdateInput = (req, res, next) => {
    const { text } = req.body;
    
    if (text !== undefined && (!text || text.trim().length < 1)) {
        return res.status(400).json({ message: 'Option text is required' });
    }
    
    next();
};

const validateUserUpdateInput = (req, res, next) => {
    const { name, email, password } = req.body;
    
    if (name !== undefined && (!name || name.trim().length < 2)) {
        return res.status(400).json({ message: 'Name must be at least 2 characters long' });
    }
    
    if (email !== undefined && (!email || !email.includes('@'))) {
        return res.status(400).json({ message: 'Valid email is required' });
    }
    
    if (password !== undefined && (!password || password.length < 6)) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    next();
};

module.exports = {
    validateUserInput,
    validateCourseInput,
    validateCourseUpdateInput,
    validateLessonInput,
    validateLessonUpdateInput,
    validateQuizInput,
    validateQuizUpdateInput,
    validateQuestionInput,
    validateQuestionUpdateInput,
    validateOptionInput,
    validateOptionUpdateInput,
    validateUserUpdateInput
}; 