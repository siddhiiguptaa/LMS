const db = require('../config/db');

class QuizAttemptAnswer {
  static async record(attemptId, questionId, selectedOptionId, isCorrect, connection = null) {
    const conn = connection || db;
    const [result] = await conn.query(
      `INSERT INTO quiz_attempt_answers 
         (attempt_id, question_id, selected_option_id, is_correct) 
       VALUES (?, ?, ?, ?)`,
      [attemptId, questionId, selectedOptionId, isCorrect]
    );
    return result.insertId;
  }

  static async findByAttempt(attemptId) {
    const [rows] = await db.query(
      `SELECT qaa.*, q.text as question, o.text as selected_text, o.is_correct 
       FROM quiz_attempt_answers qaa
       JOIN questions q ON q.id = qaa.question_id
       JOIN options o   ON o.id = qaa.selected_option_id
       WHERE qaa.attempt_id = ?`,
      [attemptId]
    );
    return rows;
  }
}

module.exports = QuizAttemptAnswer; 