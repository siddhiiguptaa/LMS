const db = require('../config/db');

class Enrollment {
  static async enroll(userId, courseId, connection = null) {
    const conn = connection || db;
    const [result] = await conn.query(
      `INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)`,
      [userId, courseId]
    );
    return result.insertId;
  }

  static async findByUser(userId, { page=1, limit=20 } = {}) {
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
      `SELECT e.*, c.title, c.instructor
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = ?
       ORDER BY e.enrolled_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  }

  static async findByCourse(courseId, { page=1, limit=20 } = {}) {
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
      `SELECT e.*, u.name, u.email
       FROM enrollments e
       JOIN users u ON u.id = e.user_id
       WHERE e.course_id = ?
       ORDER BY e.enrolled_at DESC
       LIMIT ? OFFSET ?`,
      [courseId, limit, offset]
    );
    return rows;
  }

  static async isEnrolled(userId, courseId) {
    const [rows] = await db.query(
      `SELECT 1 FROM enrollments WHERE user_id = ? AND course_id = ?`,
      [userId, courseId]
    );
    return rows.length > 0;
  }

  static async withdraw(userId, courseId, connection = null) {
    const conn = connection || db;
    const [result] = await conn.query(
      `DELETE FROM enrollments WHERE user_id = ? AND course_id = ?`,
      [userId, courseId]
    );
    return result.affectedRows;
  }
}

module.exports = Enrollment; 