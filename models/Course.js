const db = require('../config/db');

class Course {
    static async createCourse(title, description, instructor, price, connection = null) {
        const conn = connection || db;
        const [result] = await conn.query(
            'INSERT INTO courses (title, description, instructor, price) VALUES (?, ?, ?, ?)',
            [title, description, instructor, price]
        );
        return result.insertId;
    }

    static async getAllCourses() {
        const [rows] = await db.query('SELECT * FROM courses');
        return rows;
    }

    static async getCourseById(id) {
        const [rows] = await db.query(
            'SELECT * FROM courses WHERE id = ?', 
            [id]
        );
        return rows[0];
    }

    static async deleteCourse(id, connection = null) {
        const conn = connection || db;
        const [result] = await conn.query(
            'DELETE FROM courses WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }

    static async getAllCoursesWithPagination({ page=1, limit=20, search='' } = {}) {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM courses';
        let params = [];
        
        if (search) {
            query += ' WHERE title LIKE ? OR description LIKE ? OR instructor LIKE ?';
            const searchTerm = `%${search}%`;
            params = [searchTerm, searchTerm, searchTerm];
        }
        
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        
        const [rows] = await db.query(query, params);
        const [countResult] = await db.query('SELECT COUNT(*) as total FROM courses');
        const total = countResult[0].total;

        return {
            courses: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    static async updateCourse(id, { title, description, instructor, price } = {}, connection = null) {
        const conn = connection || db;
        const fields = [];
        const params = [];
        if (title != null) {
            fields.push('title = ?');
            params.push(title);
        }
        if (description != null) {
            fields.push('description = ?');
            params.push(description);
        }
        if (instructor != null) {
            fields.push('instructor = ?');
            params.push(instructor);
        }
        if (price != null) {
            fields.push('price = ?');
            params.push(price);
        }
        if (!fields.length) return 0;
        params.push(id);

        const [result] = await conn.query(
            `UPDATE courses SET ${fields.join(', ')} WHERE id = ?`,
            params
        );
        return result.affectedRows;
    }
}

module.exports = Course;