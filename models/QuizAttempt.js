const db = require('../config/db');

class QuizAttempt {
  static async start(userId, quizId, attemptNumber, score=0, connection = null) {
    const conn = connection || db;
    const [result] = await conn.query(
      `INSERT INTO quiz_attempts 
         (user_id, quiz_id, attempt_number, score) 
       VALUES (?, ?, ?, ?)`,
      [userId, quizId, attemptNumber, score]
    );
    return result.insertId;
  }

  static async updateScore(attemptId, score, connection = null) {
    const conn = connection || db;
    const [result] = await conn.query(
      `UPDATE quiz_attempts SET score = ? WHERE id = ?`,
      [score, attemptId]
    );
    return result.affectedRows;
  }

  static async findByQuizAndUser(quizId, userId) {
    const [rows] = await db.query(
      `SELECT * FROM quiz_attempts 
       WHERE quiz_id = ? AND user_id = ?
       ORDER BY attempt_number DESC`,
      [quizId, userId]
    );
    return rows;
  }

  static async findById(attemptId) {
    const [rows] = await db.query(
      `SELECT * FROM quiz_attempts WHERE id = ?`,
      [attemptId]
    );
    return rows[0];
  }

  static async findByUser(userId) {
    const [rows] = await db.query(
      `SELECT qa.*, q.title as quiz_title, c.title as course_title
       FROM quiz_attempts qa
       JOIN quizzes q ON q.id = qa.quiz_id
       JOIN courses c ON c.id = q.course_id
       WHERE qa.user_id = ?
       ORDER BY qa.attempted_at DESC`,
      [userId]
    );
    return rows;
  }
}

module.exports = QuizAttempt; 