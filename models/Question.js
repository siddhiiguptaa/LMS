const db = require('../config/db');

class Question {
  static async create(quizId, text, connection = null) {
    const conn = connection || db;
    const [result] = await conn.query(
      `INSERT INTO questions (quiz_id, text) VALUES (?, ?)`,
      [quizId, text]
    );
    return result.insertId;
  }

  static async findByQuiz(quizId) {
    const [rows] = await db.query(
      `SELECT * FROM questions WHERE quiz_id = ?`,
      [quizId]
    );
    return rows;
  }

  static async findById(questionId) {
    const [rows] = await db.query(
      `SELECT * FROM questions WHERE id = ?`,
      [questionId]
    );
    return rows[0];
  }

  static async update(questionId, text) {
    const [result] = await db.query(
      `UPDATE questions SET text = ? WHERE id = ?`,
      [text, questionId]
    );
    return result.affectedRows;
  }

  static async delete(questionId, connection = null) {
    const conn = connection || db;
    const [result] = await conn.query(
      `DELETE FROM questions WHERE id = ?`,
      [questionId]
    );
    return result.affectedRows;
  }
}

module.exports = Question; 