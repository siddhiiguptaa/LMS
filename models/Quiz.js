const db = require('../config/db');

class Quiz {
  static async create(courseId, title, connection = null) {
    const conn = connection || db;
    const [result] = await conn.query(
      `INSERT INTO quizzes (course_id, title) VALUES (?, ?)`,
      [courseId, title]
    );
    return result.insertId;
  }

  static async findByCourse(courseId) {
    const [rows] = await db.query(
      `SELECT * FROM quizzes WHERE course_id = ?`,
      [courseId]
    );
    return rows;
  }

  static async findById(quizId) {
    const [rows] = await db.query(
      `SELECT * FROM quizzes WHERE id = ?`,
      [quizId]
    );
    return rows[0];
  }

  static async update(quizId, title) {
    const [result] = await db.query(
      `UPDATE quizzes SET title = ? WHERE id = ?`,
      [title, quizId]
    );
    return result.affectedRows;
  }

  static async delete(quizId, connection = null) {
    const conn = connection || db;
    const [result] = await conn.query(
      `DELETE FROM quizzes WHERE id = ?`,
      [quizId]
    );
    return result.affectedRows;
  }
}

module.exports = Quiz; 