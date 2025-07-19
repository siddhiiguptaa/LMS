const db = require('../config/db')

class User {
    static async createUser(name, email, hashedPassword, role = 'student', connection = null) {
        const conn = connection || db;
        const [result] = await conn.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async getAllUsers({ page = 1, limit = 20, search = '' } = {}) {
        const offset = (page - 1) * limit;
        let query = 'SELECT id, name, email, role, created_at FROM users';
        let params = [];

        if (search) {
            query += ' WHERE name LIKE ? OR email LIKE ?';
            const searchTerm = `%${search}%`;
            params = [searchTerm, searchTerm];
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [rows] = await db.query(query, params);
        const [countResult] = await db.query('SELECT COUNT(*) as total FROM users');
        const total = countResult[0].total;

        return {
            users: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    static async updateUserName(id, name) {
        const [result] = await db.query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
        return result.affectedRows;
    }

    static async updateUserPassword(id, hashedPassword) {
        const [result] = await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, id]);
        return result.affectedRows;
    }

    static async deleteUser(id) {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows;
    }

    static async updateUser(id, { name, email, role } = {}, connection = null) {
        const conn = connection || db;
        const fields = [];
        const params = [];
        if (name != null) {
            fields.push('name = ?');
            params.push(name);
        }
        if (email != null) {
            fields.push('email = ?');
            params.push(email);
        }
        if (role != null) {
            fields.push('role = ?');
            params.push(role);
        }
        if (!fields.length) return 0;
        params.push(id);

        const [result] = await conn.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            params
        );
        return result.affectedRows;
    }
}

module.exports = User;